// Data contoh yang dipakai HANYA kalau Supabase gagal dihubungi, biar
// halaman publik tetap tampil utuh. Begitu koneksi database benar,
// website otomatis membaca dari Supabase dan data ini tidak terpakai.
import type { Batch, Komponen, Negara, Pesanan, Review } from "./data";

export const negaraCadangan: Negara[] = [
  { kode: "ID", nama: "Indonesia", mataUang: "IDR" },
  { kode: "TH", nama: "Thailand", mataUang: "THB" },
  { kode: "KR", nama: "Korea Selatan", mataUang: "KRW" },
  { kode: "CN", nama: "China", mataUang: "CNY" },
  { kode: "JP", nama: "Jepang", mataUang: "JPY" },
];

export const komponenCadangan: Komponen[] = [
  { id: "id-lokal", negara: "ID", nama: "GO Lokal", deskripsi: "Split barang yang sudah ada di Indonesia." },
  { id: "th-album", negara: "TH", nama: "Album & Merch", deskripsi: "Album dan merch resmi dari toko Thailand." },
  { id: "kr-album", negara: "KR", nama: "Album", deskripsi: "Album dari toko resmi Korea, termasuk po benefit." },
  { id: "cn-album", negara: "CN", nama: "Album", deskripsi: "Album versi China dari platform resmi." },
  { id: "jp-merch", negara: "JP", nama: "Merch", deskripsi: "Merch resmi dari Jepang." },
];

export const batchCadangan: Batch[] = [
  {
    id: "cn-album-batch-1",
    komponenId: "cn-album",
    nama: "Batch 1 (Contoh)",
    slug: "cn-album-batch-1",
    bukaPo: "2026-09-25",
    tutupPo: "2026-10-10",
    kursGo: 2450,
    ongkirLokal: 15000,
    ongkirInternasional: 25000,
    feeOrganizer: 5000,
    status: "po_dibuka",
    catatan: "Ini batch contoh biar kelihatan bentuk halamannya. Ganti dengan batch asli di database.",
    items: [
      { id: "cn-album-b1-s", nama: "[Contoh] Album ver. S", hargaLokal: 128, kuota: 20, terisi: 7 },
      { id: "cn-album-b1-w", nama: "[Contoh] Album ver. W", hargaLokal: 128, kuota: 20, terisi: 3 },
    ],
    tracking: [
      { status: "po_dibuka", catatan: "PO dibuka, kuota 20 slot per versi.", tanggal: "2026-09-25" },
      { status: "po_dibuka", catatan: "Kurs GO fix di 1 CNY = Rp2.450 sampai PO tutup.", tanggal: "2026-09-26" },
    ],
  },
];

export const reviewCadangan: Review[] = [
  { id: 1, batchId: "cn-album-batch-1", nama: "Buyer Contoh", tanggal: "2026-09-30", bintang: 5, teks: "[Contoh] Barang sampai aman, packing rapi banget. Ganti dengan review asli buyer." },
  { id: 2, batchId: "cn-album-batch-1", nama: "Buyer Contoh 2", tanggal: "2026-10-01", bintang: 4, teks: "[Contoh] Prosesnya cepat, admin ramah. Review asli menggantikan contoh ini." },
];

export const pesananCadangan: Pesanan[] = [
  {
    id: "p1",
    kode: "PF-CN-B1-7K3QD",
    buyerLabel: "contohbuyer",
    batchId: "cn-album-batch-1",
    batchNama: "Batch 1 (Contoh)",
    batchSlug: "cn-album-batch-1",
    items: [{ nama: "[Contoh] Album ver. S", qty: 1, hargaSatuanRp: 314000 }],
    totalRp: 359000,
    status: "menunggu_verifikasi",
    dibuat: "2026-09-26",
    waDigit: "1234",
  },
];
