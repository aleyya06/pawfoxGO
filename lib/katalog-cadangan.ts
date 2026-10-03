// Data katalog yang dipakai HANYA kalau Supabase gagal dihubungi, biar
// halaman publik tetap tampil utuh. Begitu koneksi database benar,
// website otomatis membaca dari Supabase dan data ini tidak terpakai.
// Nilai batch di sini juga yang dipakai scripts/seed.mjs: jaga keduanya sinkron.
import type { Batch, Komponen, Negara, Pesanan, Review } from "./data";

export const negaraCadangan: Negara[] = [
  { kode: "ID", nama: "Indonesia", mataUang: "IDR" },
  { kode: "TH", nama: "Thailand", mataUang: "THB" },
  { kode: "KR", nama: "Korea Selatan", mataUang: "KRW" },
  { kode: "CN", nama: "China", mataUang: "CNY" },
  { kode: "JP", nama: "Jepang", mataUang: "JPY" },
];

export const komponenCadangan: Komponen[] = [
  { id: "id-photocard", negara: "ID", nama: "Photocard", deskripsi: "Split photocard yang ready di admin." },
  { id: "th-album", negara: "TH", nama: "Album & Merch", deskripsi: "Album dan merch resmi dari toko Thailand." },
  { id: "kr-album", negara: "KR", nama: "Album", deskripsi: "Album dari toko resmi Korea, termasuk po benefit." },
  { id: "cn-album", negara: "CN", nama: "Album", deskripsi: "Album versi China dari platform resmi." },
  { id: "jp-merch", negara: "JP", nama: "Merch", deskripsi: "Merch resmi dari Jepang." },
];

export const batchCadangan: Batch[] = [
  {
    id: "cn-album-batch-1",
    komponenId: "cn-album",
    nama: "Album China Batch 1",
    slug: "cn-album-batch-1",
    bukaPo: "2026-09-25",
    tutupPo: "2026-10-10",
    kursGo: 2450,
    ongkirLokal: 15000,
    ongkirInternasional: 25000,
    feeOrganizer: 5000,
    status: "open",
    catatan: "Rate GO fix di 1 CNY = Rp2.450 sampai batch ditutup.",
    items: [
      { id: "cn-album-b1-s", nama: "Album ver. S", hargaLokal: 128, kuota: 20, terisi: 12 },
      { id: "cn-album-b1-w", nama: "Album ver. W", hargaLokal: 128, kuota: 20, terisi: 8 },
    ],
    tracking: [
      { status: "open", catatan: "Batch dibuka, kuota 20 slot per versi.", tanggal: "2026-09-25" },
      { status: "open", catatan: "Slot ver. S udah setengah terisi.", tanggal: "2026-10-01" },
    ],
  },
  {
    id: "th-album-batch-2",
    komponenId: "th-album",
    nama: "Album Thailand Batch 2",
    slug: "th-album-batch-2",
    bukaPo: "2026-09-28",
    tutupPo: "2026-10-15",
    kursGo: 480,
    ongkirLokal: 18000,
    ongkirInternasional: 30000,
    feeOrganizer: 5000,
    status: "open",
    catatan: "Pengiriman dari Bangkok sekitar 3 minggu setelah batch ditutup.",
    items: [
      { id: "th-album-b2-j", nama: "Album TH ver. J", hargaLokal: 850, kuota: 15, terisi: 6 },
      { id: "th-album-b2-pc", nama: "Official Photocard Set", hargaLokal: 320, kuota: 25, terisi: 18 },
    ],
    tracking: [{ status: "open", catatan: "Batch dibuka, rate fix 1 THB = Rp480.", tanggal: "2026-09-28" }],
  },
  {
    id: "th-merch-batch-1",
    komponenId: "th-album",
    nama: "Merch Thailand Batch 1",
    slug: "th-merch-batch-1",
    bukaPo: "2026-08-10",
    tutupPo: "2026-08-25",
    kursGo: 470,
    ongkirLokal: 18000,
    ongkirInternasional: 30000,
    feeOrganizer: 5000,
    status: "arrived_indonesia",
    items: [
      { id: "th-merch-b1-plush", nama: "Plush Doll 25cm", hargaLokal: 690, kuota: 10, terisi: 10 },
      { id: "th-merch-b1-tote", nama: "Tote Bag Limited", hargaLokal: 450, kuota: 15, terisi: 9 },
    ],
    tracking: [
      { status: "open", catatan: "Batch dibuka untuk merch limited.", tanggal: "2026-08-10" },
      { status: "done_checkout", catatan: "Semua buyer udah checkout.", tanggal: "2026-08-25" },
      { status: "arrived_wh_asal", catatan: "Barang sampai warehouse Bangkok.", tanggal: "2026-09-05" },
      { status: "arrived_indonesia", catatan: "Sampai Jakarta, udah lewat bea cukai.", tanggal: "2026-10-01" },
    ],
  },
  {
    id: "kr-album-batch-5",
    komponenId: "kr-album",
    nama: "Album Korea Batch 5",
    slug: "kr-album-batch-5",
    bukaPo: "2026-09-01",
    tutupPo: "2026-09-20",
    kursGo: 12,
    ongkirLokal: 12000,
    ongkirInternasional: 28000,
    feeOrganizer: 5000,
    status: "arrived_wh_asal",
    items: [
      { id: "kr-album-b5-rand", nama: "Album ver. Random", hargaLokal: 16800, kuota: 30, terisi: 27 },
      { id: "kr-album-b5-pob", nama: "POB Photocard", hargaLokal: 3500, kuota: 30, terisi: 21 },
    ],
    tracking: [
      { status: "open", catatan: "Batch dibuka, rate fix 1 KRW = Rp12.", tanggal: "2026-09-01" },
      { status: "done_checkout", catatan: "Batch ditutup, 27/30 slot album terisi.", tanggal: "2026-09-20" },
      { status: "arrived_wh_asal", catatan: "Barang lengkap sampai warehouse Korea dan udah dikirim.", tanggal: "2026-10-02" },
    ],
  },
  {
    id: "jp-merch-batch-2",
    komponenId: "jp-merch",
    nama: "Merch Jepang Batch 2",
    slug: "jp-merch-batch-2",
    bukaPo: "2026-08-05",
    tutupPo: "2026-08-30",
    kursGo: 108,
    ongkirLokal: 16000,
    ongkirInternasional: 32000,
    feeOrganizer: 5000,
    status: "arrived_admin",
    items: [
      { id: "jp-merch-b2-mag", nama: "Official Fan Magazine Vol. 9", hargaLokal: 2200, kuota: 12, terisi: 11 },
      { id: "jp-merch-b2-acs", nama: "Acrylic Stand", hargaLokal: 1650, kuota: 12, terisi: 7 },
    ],
    tracking: [
      { status: "open", catatan: "Batch dibuka untuk fan magazine vol. 9.", tanggal: "2026-08-05" },
      { status: "done_checkout", catatan: "Batch ditutup tepat waktu.", tanggal: "2026-08-30" },
      { status: "arrived_wh_asal", catatan: "Sampai warehouse Tokyo.", tanggal: "2026-09-12" },
      { status: "arrived_indonesia", catatan: "Tiba di Jakarta dan lolos bea cukai.", tanggal: "2026-10-01" },
      { status: "arrived_admin", catatan: "Sampai admin, lagi dibagi per buyer.", tanggal: "2026-10-03" },
    ],
  },
  {
    id: "id-photocard-smtr25",
    komponenId: "id-photocard",
    nama: "Photocard SMTR25",
    slug: "photocard-smtr25",
    bukaPo: "2026-09-15",
    tutupPo: "2026-10-05",
    kursGo: 1,
    ongkirLokal: 10000,
    ongkirInternasional: 0,
    feeOrganizer: 5000,
    status: "arrived_admin",
    catatan: "Barang udah arrived di admin, tinggal diambil atau dikirim.",
    items: [
      { id: "id-pc-smtr25-slot", nama: "Slot Photocard SMTR25", hargaLokal: 145000, kuota: 10, terisi: 4 },
      { id: "id-pc-smtr25-random", nama: "Photocard Random", hargaLokal: 25000, kuota: 20, terisi: 13 },
    ],
    tracking: [
      { status: "open", catatan: "Split dibuka, barang ready stock.", tanggal: "2026-09-15" },
      { status: "arrived_admin", catatan: "Photocard udah arrived di admin, siap dibagi.", tanggal: "2026-10-03" },
    ],
  },
];

export const reviewCadangan: Review[] = [
  { id: 1, batchId: "th-merch-batch-1", nama: "Nayla", tanggal: "2026-09-30", bintang: 5, teks: "Plush doll-nya sampai dalam kondisi sempurna, dibungkus bubble wrap berlapis. Admin sabar jawab pertanyaan." },
  { id: 2, batchId: "kr-album-batch-5", nama: "Rara", tanggal: "2026-10-01", bintang: 4, teks: "Update tracking-nya rajin, jadi nggak perlu nanya-nanya. Minus dikit di jadwal yang geser, tapi aman." },
];

export const pesananCadangan: Pesanan[] = [
  {
    id: "p1",
    kode: "PF-CN-B1-7K3QD",
    buyerLabel: "buyerperdana",
    batchId: "cn-album-batch-1",
    batchNama: "Album China Batch 1",
    batchSlug: "cn-album-batch-1",
    items: [{ nama: "Album ver. S", qty: 1, hargaSatuanRp: 314000 }],
    totalRp: 359000,
    status: "menunggu_verifikasi",
    dibuat: "2026-09-26",
    waDigit: "1234",
  },
];
