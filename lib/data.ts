// Tipe dan aturan hitung bersama. Isi katalog sekarang tinggal di Supabase
// dan dibaca lewat lib/db.ts; file ini cuma pegang bentuk data dan konstanta.

export type KodeMataUang = "IDR" | "THB" | "KRW" | "CNY" | "JPY";

export const MATA_UANG: Record<KodeMataUang, { simbol: string; nama: string }> = {
  IDR: { simbol: "Rp", nama: "Rupiah" },
  THB: { simbol: "THB", nama: "Baht" },
  KRW: { simbol: "KRW", nama: "Won" },
  CNY: { simbol: "CNY", nama: "Yuan" },
  JPY: { simbol: "JPY", nama: "Yen" },
};

export const MATA_UANG_LUAR: KodeMataUang[] = ["THB", "KRW", "CNY", "JPY"];

// Kurs cadangan dipakai HANYA kalau kurs live gagal diambil. Angka kasar,
// bukan kurs resmi; halaman selalu memberi tahu buyer kalau ini yang terpakai.
export const KURS_CADANGAN: Record<Exclude<KodeMataUang, "IDR">, number> = {
  THB: 430,
  KRW: 11.4,
  CNY: 2350,
  JPY: 105,
};

export const KONTAK = {
  x: "https://x.com/pawfoxgo",
  xHandle: "@pawfoxgo",
  email: "pawfox0512@gmail.com",
};

export type StatusTracking =
  | "open"
  | "done_checkout"
  | "arrived_wh_asal"
  | "arrived_indonesia"
  | "arrived_admin";

export const STATUS_TRACKING: { id: StatusTracking; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "done_checkout", label: "Done checkout" },
  { id: "arrived_wh_asal", label: "Arrived WH negara asal" },
  { id: "arrived_indonesia", label: "Arrived Indonesia" },
  { id: "arrived_admin", label: "Arrived admin" },
];

export function labelStatus(status: StatusTracking): string {
  return STATUS_TRACKING.find((s) => s.id === status)?.label ?? status;
}

export function urutanStatus(status: StatusTracking): number {
  return STATUS_TRACKING.findIndex((s) => s.id === status);
}

export interface Negara {
  kode: string;
  nama: string;
  mataUang: KodeMataUang;
}

export interface Komponen {
  id: string;
  negara: string;
  nama: string;
  deskripsi: string;
}

export interface ItemBatch {
  id: string;
  nama: string;
  hargaLokal: number;
  kuota: number;
  terisi: number;
}

export interface UpdateTracking {
  status: StatusTracking;
  catatan: string;
  tanggal: string;
}

export interface Batch {
  id: string;
  komponenId: string;
  nama: string;
  slug: string;
  bukaPo: string;
  tutupPo: string;
  kursGo: number;
  ongkirLokal: number;
  ongkirInternasional: number;
  feeOrganizer: number;
  status: StatusTracking;
  catatan?: string;
  items: ItemBatch[];
  tracking: UpdateTracking[];
}

export interface Profil {
  id: string;
  nama: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export type StatusPesanan = "menunggu_bayar" | "menunggu_verifikasi" | "lunas" | "dibatalkan" | "refund";

export const LABEL_STATUS_PESANAN: Record<StatusPesanan, string> = {
  menunggu_bayar: "Menunggu bayar",
  menunggu_verifikasi: "Menunggu verifikasi",
  lunas: "Lunas",
  dibatalkan: "Dibatalkan",
  refund: "Refund",
};

export function nadaStatusPesanan(status: StatusPesanan): "badge-orange" | "badge-blush" | "badge-netral" {
  if (status === "lunas") return "badge-blush";
  if (status === "menunggu_bayar" || status === "menunggu_verifikasi") return "badge-orange";
  return "badge-netral";
}

export interface Pesanan {
  id: string;
  kode: string;
  buyerLabel: string;
  batchId: string;
  batchNama: string;
  batchSlug: string;
  items: { nama: string; qty: number; hargaSatuanRp: number }[];
  totalRp: number;
  status: StatusPesanan;
  dibuat: string;
  waDigit?: string;
  catatan?: string;
}

export interface Review {
  id: number;
  batchId: string;
  nama: string;
  tanggal: string;
  bintang: number;
  teks: string;
}

export function totalSlot(batch: Batch): { terisi: number; kuota: number } {
  return {
    terisi: batch.items.reduce((a, i) => a + i.terisi, 0),
    kuota: batch.items.reduce((a, i) => a + i.kuota, 0),
  };
}

export function biayaPerSlot(batch: Batch): number {
  return batch.ongkirLokal + batch.ongkirInternasional + batch.feeOrganizer;
}

// Harga dikonversi dengan kurs GO lalu dibulatkan ke atas ke Rp500 terdekat,
// kebiasaan umum organizer supaya tidak menanggung selisih kurs.
export function hargaRupiah(hargaLokal: number, kursGo: number): number {
  return Math.ceil((hargaLokal * kursGo) / 500) * 500;
}
