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
    nama: "Album China Batch 1",
    slug: "cn-album-batch-1",
    bukaPo: "2026-09-25",
    tutupPo: "2026-10-10",
    kursGo: 2450,
    ongkirLokal: 15000,
    ongkirInternasional: 25000,
    feeOrganizer: 5000,
    status: "po_dibuka",
    catatan: "Kurs GO fix di 1 CNY = Rp2.450 sampai PO tutup.",
    items: [
      { id: "cn-album-b1-s", nama: "Album ver. S", hargaLokal: 128, kuota: 20, terisi: 12 },
      { id: "cn-album-b1-w", nama: "Album ver. W", hargaLokal: 128, kuota: 20, terisi: 8 },
    ],
    tracking: [
      { status: "po_dibuka", catatan: "PO dibuka, kuota 20 slot per versi.", tanggal: "2026-09-25" },
      { status: "po_dibuka", catatan: "Slot ver. S udah setengah terisi.", tanggal: "2026-10-01" },
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
    status: "po_dibuka",
    catatan: "Pengiriman dari Bangkok sekitar 3 minggu setelah PO tutup.",
    items: [
      { id: "th-album-b2-j", nama: "Album TH ver. J", hargaLokal: 850, kuota: 15, terisi: 6 },
      { id: "th-album-b2-pc", nama: "Official Photocard Set", hargaLokal: 320, kuota: 25, terisi: 18 },
    ],
    tracking: [{ status: "po_dibuka", catatan: "PO dibuka, kurs fix 1 THB = Rp480.", tanggal: "2026-09-28" }],
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
    status: "tiba_indonesia",
    items: [
      { id: "th-merch-b1-plush", nama: "Plush Doll 25cm", hargaLokal: 690, kuota: 10, terisi: 10 },
      { id: "th-merch-b1-tote", nama: "Tote Bag Limited", hargaLokal: 450, kuota: 15, terisi: 9 },
    ],
    tracking: [
      { status: "po_dibuka", catatan: "PO dibuka untuk merch limited.", tanggal: "2026-08-10" },
      { status: "po_ditutup", catatan: "PO tutup, plush doll full slot.", tanggal: "2026-08-25" },
      { status: "warehouse_asal", catatan: "Semua barang sampai warehouse Bangkok.", tanggal: "2026-09-05" },
      { status: "berangkat", catatan: "Berangkat via kargo udara.", tanggal: "2026-09-18" },
      { status: "tiba_indonesia", catatan: "Sampai Jakarta, lagi proses bea cukai.", tanggal: "2026-10-01" },
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
    status: "berangkat",
    items: [
      { id: "kr-album-b5-rand", nama: "Album ver. Random", hargaLokal: 16800, kuota: 30, terisi: 27 },
      { id: "kr-album-b5-pob", nama: "POB Photocard", hargaLokal: 3500, kuota: 30, terisi: 21 },
    ],
    tracking: [
      { status: "po_dibuka", catatan: "PO dibuka, kurs fix 1 KRW = Rp12.", tanggal: "2026-09-01" },
      { status: "po_ditutup", catatan: "PO tutup, 27/30 slot album terisi.", tanggal: "2026-09-20" },
      { status: "produksi", catatan: "Menunggu rilis resmi album.", tanggal: "2026-09-22" },
      { status: "warehouse_asal", catatan: "Barang lengkap sampai warehouse Korea.", tanggal: "2026-09-29" },
      { status: "berangkat", catatan: "Berangkat dari Incheon.", tanggal: "2026-10-02" },
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
    status: "sorting",
    items: [
      { id: "jp-merch-b2-mag", nama: "Official Fan Magazine Vol. 9", hargaLokal: 2200, kuota: 12, terisi: 11 },
      { id: "jp-merch-b2-acs", nama: "Acrylic Stand", hargaLokal: 1650, kuota: 12, terisi: 7 },
    ],
    tracking: [
      { status: "po_dibuka", catatan: "PO dibuka untuk fan magazine vol. 9.", tanggal: "2026-08-05" },
      { status: "po_ditutup", catatan: "PO tutup tepat waktu.", tanggal: "2026-08-30" },
      { status: "warehouse_asal", catatan: "Sampai warehouse Tokyo.", tanggal: "2026-09-12" },
      { status: "berangkat", catatan: "Berangkat via kargo laut+jalur cepat.", tanggal: "2026-09-20" },
      { status: "tiba_indonesia", catatan: "Tiba di Jakarta dan lolos bea cukai.", tanggal: "2026-10-01" },
      { status: "sorting", catatan: "Sorting per nama buyer di warehouse lokal.", tanggal: "2026-10-03" },
    ],
  },
  {
    id: "id-lokal-batch-1",
    komponenId: "id-lokal",
    nama: "Split GO Lokal Batch 1",
    slug: "id-lokal-batch-1",
    bukaPo: "2026-09-15",
    tutupPo: "2026-10-05",
    kursGo: 1,
    ongkirLokal: 10000,
    ongkirInternasional: 0,
    feeOrganizer: 5000,
    status: "po_dibuka",
    catatan: "Barang ready di tangan, tinggal split ongkir domestik.",
    items: [
      { id: "id-lokal-b1-slot", nama: "Album Split Slot", hargaLokal: 145000, kuota: 10, terisi: 4 },
      { id: "id-lokal-b1-pc", nama: "Photocard Random", hargaLokal: 25000, kuota: 20, terisi: 13 },
    ],
    tracking: [{ status: "po_dibuka", catatan: "Split dibuka, barang ready stock.", tanggal: "2026-09-15" }],
  },
];

export const reviewCadangan: Review[] = [
  { id: 1, batchId: "th-merch-batch-1", nama: "Buyer Contoh", tanggal: "2026-09-30", bintang: 5, teks: "[Contoh] Barang sampai aman, packing rapi banget. Review asli buyer akan menggantikan yang ini lewat form di bawah." },
  { id: 2, batchId: "kr-album-batch-5", nama: "Buyer Contoh 2", tanggal: "2026-10-01", bintang: 4, teks: "[Contoh] Prosesnya cepat, admin ramah. Kirim review aslimu lewat form, ya." },
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
