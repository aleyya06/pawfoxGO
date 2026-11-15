// Bentuk data siap tampil untuk tiket batch, hero, dan tracking. Dihitung di
// server (halaman force-dynamic) supaya "tanggal tutup lewat" dan sisa hari
// tidak berbeda antara server dan browser saat hydration.
import {
  A2O_SOUL_MEMBERS,
  AWALAN_ITEM_MEMBER,
  labelStatus,
  totalSlot,
  type Batch,
  type ItemBatch,
  type KodeMataUang,
  type StatusTracking,
} from "./data";
import { formatTanggal } from "./format";
import type { Katalog } from "./db";

// Kode bandara asal per negara, dipilih organizer (Q10): Bangkok dan Tokyo
// tercatat di tracking, Incheon gerbang kargo utama Korea, Shanghai untuk China.
// Tujuan CGK karena catatan tracking menyebut barang tiba di Jakarta.
export const IATA_ASAL: Record<string, string> = {
  TH: "BKK",
  KR: "ICN",
  CN: "PVG",
  JP: "NRT",
};
export const IATA_TUJUAN = "CGK";

export interface SlotMember {
  nama: string;
  terisi: number;
  kuota: number;
}

// Slot photocard per member dari item "POB Photocard · <Nama>", urut sesuai
// A2O_SOUL_MEMBERS. Item yang namanya bukan member terdaftar diabaikan.
export function slotMember(items: ItemBatch[]): SlotMember[] {
  return A2O_SOUL_MEMBERS.flatMap((nama) => {
    const item = items.find((i) => i.nama.toLowerCase() === `${AWALAN_ITEM_MEMBER}${nama}`.toLowerCase());
    return item ? [{ nama, terisi: item.terisi, kuota: item.kuota }] : [];
  });
}

export interface TiketData {
  id: string;
  slug: string;
  nama: string;
  negaraKode: string;
  negaraNama: string;
  komponen: string;
  mataUang: KodeMataUang;
  kursGo: number;
  status: StatusTracking;
  statusLabel: string;
  tutupLabel: string;
  lewat: boolean;
  sisaHari: number | null;
  terisi: number;
  kuota: number;
  iata: string | null;
  member: SlotMember[];
}

// PO ditutup di akhir hari tanggal tutup, waktu Indonesia barat.
export function batasTutup(tutupPo: string): number {
  return new Date(`${tutupPo}T23:59:59+07:00`).getTime();
}

// Batch dianggap buka hanya kalau statusnya Open DAN tanggal tutupnya belum
// lewat. Status Open yang lewat tenggat tampil sebagai "Closed" sampai admin
// memindahkannya ke status berikutnya.
export function masihBuka(batch: Batch, sekarang: number): boolean {
  return batch.status === "open" && sekarang <= batasTutup(batch.tutupPo);
}

export function keTiket(katalog: Katalog, batch: Batch, sekarang: number): TiketData {
  const info = katalog.lengkap(batch.id)!;
  const slot = totalSlot(batch);
  const batas = batasTutup(batch.tutupPo);
  // "Lewat" hanya berarti untuk batch yang masih berstatus Open: tanggal
  // tutupnya sudah lewat tapi admin belum memindahkan statusnya.
  const lewat = batch.status === "open" && sekarang > batas;
  return {
    id: batch.id,
    slug: batch.slug,
    nama: batch.nama,
    negaraKode: info.negara.kode,
    negaraNama: info.negara.nama,
    komponen: info.komponen.nama,
    mataUang: info.negara.mataUang,
    kursGo: batch.kursGo,
    status: batch.status,
    statusLabel: labelStatus(batch.status),
    tutupLabel: formatTanggal(batch.tutupPo),
    lewat,
    sisaHari: sekarang > batas ? null : Math.max(1, Math.ceil((batas - sekarang) / 86_400_000)),
    terisi: slot.terisi,
    kuota: slot.kuota,
    iata: IATA_ASAL[info.negara.kode] ?? null,
    member: slotMember(batch.items),
  };
}

export function negaraBatch(katalog: Katalog, batch: Batch): string {
  return katalog.komponenList.find((k) => k.id === batch.komponenId)?.negara ?? "";
}

// Estimasi kirim dihitung dari data nyata: jarak hari antara update
// "Done checkout" dan "Arrived Indonesia" di batch terakhir yang sudah tiba.
// Kalau belum ada batch yang tiba, hasilnya null dan UI bilang apa adanya.
export function estimasiKirim(katalog: Katalog, kodeNegara: string): { hari: number; batchNama: string } | null {
  const selesai = katalog.batchList
    .filter((b) => negaraBatch(katalog, b) === kodeNegara)
    .map((b) => {
      const checkout = b.tracking.find((t) => t.status === "done_checkout");
      const tiba = b.tracking.find((t) => t.status === "arrived_indonesia");
      return checkout && tiba ? { b, checkout: checkout.tanggal, tiba: tiba.tanggal } : null;
    })
    .filter((x): x is { b: Batch; checkout: string; tiba: string } => x !== null)
    .sort((a, b) => b.tiba.localeCompare(a.tiba));
  const terakhir = selesai[0];
  if (!terakhir) return null;
  const hari = Math.round((Date.parse(terakhir.tiba) - Date.parse(terakhir.checkout)) / 86_400_000);
  return hari > 0 ? { hari, batchNama: terakhir.b.nama } : null;
}

export interface NegaraHero {
  kode: string;
  nama: string;
  mataUang: KodeMataUang;
  iata: string;
  buka: number;
  estimasi: { hari: number; batchNama: string } | null;
}

export function dataHero(katalog: Katalog, sekarang: number): NegaraHero[] {
  return katalog.negaraList
    .filter((n) => IATA_ASAL[n.kode])
    .map((n) => ({
      kode: n.kode,
      nama: n.nama,
      mataUang: n.mataUang,
      iata: IATA_ASAL[n.kode],
      buka: katalog.batchList.filter((b) => masihBuka(b, sekarang) && negaraBatch(katalog, b) === n.kode).length,
      estimasi: estimasiKirim(katalog, n.kode),
    }));
}

export function updateTerakhir(batch: Batch) {
  return batch.tracking.length > 0 ? batch.tracking[batch.tracking.length - 1] : undefined;
}
