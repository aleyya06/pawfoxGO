// Data katalog yang dipakai HANYA kalau Supabase gagal dihubungi, biar
// halaman publik tetap tampil utuh. Begitu koneksi database benar,
// website otomatis membaca dari Supabase dan data ini tidak terpakai.
// Nilai batch di sini juga yang dipakai scripts/seed.mjs: jaga keduanya sinkron.
//
// Batch A2O SOUL dari organizer (November 2026). Yang belum diberikan organizer
// sengaja dibiarkan kosong, bukan dikarang:
// - hargaLokal 0 = harga item belum diisi; halaman menulis "Menyusul" dan
//   panel admin menolak membuat tagihan untuk item itu.
// - bukaPo sama dengan tutupPo = tanggal buka belum dicatat; tidak ditampilkan.
// - ongkir dan fee 0 sampai diisi admin.
// - tracking kosong sampai admin menulis update lewat panel.
import type { Batch, Komponen, Negara, Pesanan, Review } from "./data";

export const negaraCadangan: Negara[] = [
  { kode: "ID", nama: "Indonesia", mataUang: "IDR" },
  { kode: "TH", nama: "Thailand", mataUang: "THB" },
  { kode: "KR", nama: "Korea Selatan", mataUang: "KRW" },
  { kode: "CN", nama: "China", mataUang: "CNY" },
  { kode: "JP", nama: "Jepang", mataUang: "JPY" },
];

export const komponenCadangan: Komponen[] = [
  { id: "id-pc-a2o", negara: "ID", nama: "Photocard A2O SOUL", deskripsi: "Pooling photocard member A2O SOUL di admin." },
  { id: "kr-album-pob-a2o", negara: "KR", nama: "Album & POB A2O SOUL", deskripsi: "Album A2O SOUL SUPERSTAR dengan POB toko Korea." },
  { id: "kr-pob-a2o", negara: "KR", nama: "POB A2O SOUL", deskripsi: "POB A2O SOUL dari toko Korea." },
  { id: "cn-pob-a2o", negara: "CN", nama: "POB A2O SOUL", deskripsi: "POB A2O SOUL dari toko China." },
];

function batchSuperstar(toko: string, slug: string, tutupPo: string, terisi: number): Batch {
  return {
    id: slug,
    komponenId: "kr-album-pob-a2o",
    nama: `A2O SOUL — Superstar (${toko} POB)`,
    slug,
    bukaPo: tutupPo,
    tutupPo,
    kursGo: 12,
    ongkirLokal: 0,
    ongkirInternasional: 0,
    feeOrganizer: 0,
    status: "open",
    items: [{ id: `${slug}-album`, nama: `Album SUPERSTAR + POB ${toko}`, hargaLokal: 0, kuota: 40, terisi }],
    tracking: [],
  };
}

export const batchCadangan: Batch[] = [
  batchSuperstar("MAKESTAR", "a2o-soul-superstar-makestar", "2026-11-28", 18),
  batchSuperstar("APPLE MUSIC", "a2o-soul-superstar-apple-music", "2026-11-30", 14),
  batchSuperstar("MUSICPLANT", "a2o-soul-superstar-musicplant", "2026-12-02", 12),
  batchSuperstar("WITHMUU", "a2o-soul-superstar-withmuu", "2026-12-05", 22),
  {
    id: "photocard-member-a2o-soul-pooling",
    komponenId: "id-pc-a2o",
    nama: "Photocard Member A2O SOUL (Pooling)",
    slug: "photocard-member-a2o-soul-pooling",
    bukaPo: "2026-11-05",
    tutupPo: "2026-11-05",
    kursGo: 1,
    ongkirLokal: 0,
    ongkirInternasional: 0,
    feeOrganizer: 0,
    status: "arrived_admin",
    items: [{ id: "photocard-member-a2o-soul-slot", nama: "Slot photocard member (pooling)", hargaLokal: 0, kuota: 30, terisi: 24 }],
    tracking: [],
  },
  {
    id: "pob-a2o-soul-superstar-pre-release",
    komponenId: "kr-pob-a2o",
    nama: "POB A2O SOUL — Superstar Pre-Release",
    slug: "pob-a2o-soul-superstar-pre-release",
    bukaPo: "2026-11-01",
    tutupPo: "2026-11-01",
    kursGo: 12,
    ongkirLokal: 0,
    ongkirInternasional: 0,
    feeOrganizer: 0,
    status: "arrived_wh_asal",
    items: [{ id: "pob-a2o-soul-pre-release", nama: "POB Superstar Pre-Release", hargaLokal: 0, kuota: 40, terisi: 35 }],
    tracking: [],
  },
  {
    id: "pob-a2o-soul-china-exclusive",
    komponenId: "cn-pob-a2o",
    nama: "POB A2O SOUL — China Exclusive",
    slug: "pob-a2o-soul-china-exclusive",
    bukaPo: "2026-10-20",
    tutupPo: "2026-10-20",
    kursGo: 2450,
    ongkirLokal: 0,
    ongkirInternasional: 0,
    feeOrganizer: 0,
    status: "arrived_indonesia",
    items: [{ id: "pob-a2o-soul-china-exclusive", nama: "POB China Exclusive", hargaLokal: 0, kuota: 30, terisi: 28 }],
    tracking: [],
  },
];

// Review hanya dari buyer sungguhan lewat form beranda; tidak ada isian bawaan.
export const reviewCadangan: Review[] = [];

export const pesananCadangan: Pesanan[] = [];
