// Isi katalog A2O SOUL ke Supabase dan bersihkan batch sampel lama.
// Jalankan: node --env-file=.env.local scripts/seed.mjs
// Isinya disamakan dengan lib/katalog-cadangan.ts (jaga keduanya sinkron).
//
// Sebelum mengubah apa pun, isi tabel yang tersentuh disalin ke
// backup/supabase-<waktu>.json (folder backup/ tidak ikut git).
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const kunci = process.env.SUPABASE_SECRET_KEY;
if (!url || !kunci || !url.startsWith("https://")) {
  console.error("SUPABASE_URL / SUPABASE_SECRET_KEY belum benar di .env.local");
  process.exit(1);
}
const sb = createClient(url, kunci, { auth: { persistSession: false } });

function cekGagal(salah, label) {
  if (salah) {
    console.error(`Gagal ${label}:`, salah.message);
    process.exit(1);
  }
}

async function ambil(tabel) {
  const { data, error } = await sb.from(tabel).select("*");
  cekGagal(error, `membaca ${tabel}`);
  return data ?? [];
}

// ---- Data A2O SOUL -------------------------------------------------------
// harga_lokal 0 = harga belum diisi organizer (halaman menulis "Menyusul").
// buka_po sama dengan tutup_po = tanggal buka belum dicatat (tidak ditampilkan).

const negara = [
  { kode: "ID", nama: "Indonesia", mata_uang: "IDR", urutan: 1 },
  { kode: "TH", nama: "Thailand", mata_uang: "THB", urutan: 2 },
  { kode: "KR", nama: "Korea Selatan", mata_uang: "KRW", urutan: 3 },
  { kode: "CN", nama: "China", mata_uang: "CNY", urutan: 4 },
  { kode: "JP", nama: "Jepang", mata_uang: "JPY", urutan: 5 },
];

const komponen = [
  { id: "id-pc-a2o", country_kode: "ID", nama: "Photocard A2O SOUL", deskripsi: "Pooling photocard member A2O SOUL di admin.", urutan: 1 },
  { id: "kr-album-pob-a2o", country_kode: "KR", nama: "Album & POB A2O SOUL", deskripsi: "Album A2O SOUL SUPERSTAR dengan POB toko Korea.", urutan: 1 },
  { id: "kr-pob-a2o", country_kode: "KR", nama: "POB A2O SOUL", deskripsi: "POB A2O SOUL dari toko Korea.", urutan: 2 },
  { id: "cn-pob-a2o", country_kode: "CN", nama: "POB A2O SOUL", deskripsi: "POB A2O SOUL dari toko China.", urutan: 1 },
];

const tanpaBiaya = { ongkir_lokal: 0, ongkir_internasional: 0, fee_organizer: 0, catatan: null };

const superstar = [
  ["MAKESTAR", "a2o-soul-superstar-makestar", "2026-11-28", 18],
  ["APPLE MUSIC", "a2o-soul-superstar-apple-music", "2026-11-30", 14],
  ["MUSICPLANT", "a2o-soul-superstar-musicplant", "2026-12-02", 12],
  ["WITHMUU", "a2o-soul-superstar-withmuu", "2026-12-05", 22],
];

const batches = [
  ...superstar.map(([toko, slug, tutup]) => ({
    id: slug,
    component_id: "kr-album-pob-a2o",
    nama: `A2O SOUL — Superstar (${toko} POB)`,
    slug,
    buka_po: tutup,
    tutup_po: tutup,
    kurs_go: 12,
    status: "open",
    ...tanpaBiaya,
  })),
  {
    id: "photocard-member-a2o-soul-pooling",
    component_id: "id-pc-a2o",
    nama: "Photocard Member A2O SOUL (Pooling)",
    slug: "photocard-member-a2o-soul-pooling",
    buka_po: "2026-11-05",
    tutup_po: "2026-11-05",
    kurs_go: 1,
    status: "arrived_admin",
    ...tanpaBiaya,
  },
  {
    id: "pob-a2o-soul-superstar-pre-release",
    component_id: "kr-pob-a2o",
    nama: "POB A2O SOUL — Superstar Pre-Release",
    slug: "pob-a2o-soul-superstar-pre-release",
    buka_po: "2026-11-01",
    tutup_po: "2026-11-01",
    kurs_go: 12,
    status: "arrived_wh_asal",
    ...tanpaBiaya,
  },
  {
    id: "pob-a2o-soul-china-exclusive",
    component_id: "cn-pob-a2o",
    nama: "POB A2O SOUL — China Exclusive",
    slug: "pob-a2o-soul-china-exclusive",
    buka_po: "2026-10-20",
    tutup_po: "2026-10-20",
    kurs_go: 2450,
    status: "arrived_indonesia",
    ...tanpaBiaya,
  },
];

const items = [
  ...superstar.map(([toko, slug, , terisi]) => ({
    id: `${slug}-album`,
    batch_id: slug,
    nama: `Album SUPERSTAR + POB ${toko}`,
    harga_lokal: 0,
    kuota: 40,
    terisi,
    urutan: 1,
  })),
  { id: "photocard-member-a2o-soul-slot", batch_id: "photocard-member-a2o-soul-pooling", nama: "Slot photocard member (pooling)", harga_lokal: 0, kuota: 30, terisi: 24, urutan: 1 },
  { id: "pob-a2o-soul-pre-release", batch_id: "pob-a2o-soul-superstar-pre-release", nama: "POB Superstar Pre-Release", harga_lokal: 0, kuota: 40, terisi: 35, urutan: 1 },
  { id: "pob-a2o-soul-china-exclusive", batch_id: "pob-a2o-soul-china-exclusive", nama: "POB China Exclusive", harga_lokal: 0, kuota: 30, terisi: 28, urutan: 1 },
];

// ---- Batch sampel lama yang diganti ---------------------------------------
const batchLama = ["cn-album-batch-1", "th-album-batch-2", "th-merch-batch-1", "kr-album-batch-5", "jp-merch-batch-2", "id-photocard-smtr25"];
const komponenLama = ["id-photocard", "th-album", "kr-album", "cn-album", "jp-merch"];
const orderDemo = "PF-CN-B1-7K3QD";
const reviewSampel = ["Nayla", "Rara"];

// ---- 1. Backup ------------------------------------------------------------
const backup = {};
for (const t of ["countries", "components", "batches", "batch_items", "tracking_updates", "orders", "order_items", "payments", "reviews"]) {
  backup[t] = await ambil(t);
}
mkdirSync("backup", { recursive: true });
const fileBackup = `backup/supabase-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(fileBackup, JSON.stringify(backup, null, 2));
console.log(`Backup tersimpan: ${fileBackup}`);

// ---- 2. Pengaman: jangan hapus pesanan sungguhan -----------------------------
const orderDiBatchLama = backup.orders.filter((o) => batchLama.includes(o.batch_id));
const orderAsli = orderDiBatchLama.filter((o) => o.kode !== orderDemo);
if (orderAsli.length > 0) {
  console.error(`Berhenti: ada ${orderAsli.length} pesanan selain order demo di batch sampel. Tidak ada yang diubah.`);
  process.exit(1);
}

// ---- 3. Bersihkan batch sampel ------------------------------------------------
const idOrderDemo = orderDiBatchLama.map((o) => o.id);
if (idOrderDemo.length > 0) {
  cekGagal((await sb.from("payments").delete().in("order_id", idOrderDemo)).error, "hapus payments demo");
  cekGagal((await sb.from("order_items").delete().in("order_id", idOrderDemo)).error, "hapus order_items demo");
  cekGagal((await sb.from("orders").delete().in("id", idOrderDemo)).error, "hapus order demo");
}

// Review sampel bawaan seed dihapus; review lain dari form (misalnya yang
// disembunyikan admin) disimpan, hanya dilepas dari batch sampel.
const reviewLama = backup.reviews.filter((r) => batchLama.includes(r.batch_id));
const hapusReview = reviewLama.filter((r) => reviewSampel.includes(r.nama) && !r.profile_id).map((r) => r.id);
const lepasReview = reviewLama.filter((r) => !hapusReview.includes(r.id)).map((r) => r.id);
if (hapusReview.length > 0) cekGagal((await sb.from("reviews").delete().in("id", hapusReview)).error, "hapus review sampel");
if (lepasReview.length > 0) cekGagal((await sb.from("reviews").update({ batch_id: null }).in("id", lepasReview)).error, "lepas review dari batch sampel");

cekGagal((await sb.from("tracking_updates").delete().in("batch_id", batchLama)).error, "hapus tracking sampel");
cekGagal((await sb.from("batch_items").delete().in("batch_id", batchLama)).error, "hapus item sampel");
cekGagal((await sb.from("batches").delete().in("id", batchLama)).error, "hapus batch sampel");
cekGagal((await sb.from("components").delete().in("id", komponenLama)).error, "hapus komponen sampel");

// ---- 4. Isi katalog A2O SOUL ----------------------------------------------------
cekGagal((await sb.from("countries").upsert(negara)).error, "upsert countries");
cekGagal((await sb.from("components").upsert(komponen)).error, "upsert components");
cekGagal((await sb.from("batches").upsert(batches)).error, "upsert batches");
cekGagal((await sb.from("batch_items").upsert(items)).error, "upsert batch_items");

console.log(`Seed selesai. Dihapus: ${batchLama.length} batch sampel, ${hapusReview.length} review sampel, ${idOrderDemo.length} order demo. Review dilepas dari batch sampel: ${lepasReview.length}.`);
for (const t of ["countries", "components", "batches", "batch_items", "tracking_updates", "orders", "reviews"]) {
  const { count } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(`  ${t}: ${count ?? 0} baris`);
}
