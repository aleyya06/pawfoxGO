// Seed data contoh ke Supabase. Jalankan: node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const kunci = process.env.SUPABASE_SECRET_KEY;
if (!url || !kunci || !url.startsWith("https://")) {
  console.error("SUPABASE_URL / SUPABASE_SECRET_KEY belum benar di .env.local");
  process.exit(1);
}
const sb = createClient(url, kunci, { auth: { persistSession: false } });

async function cekGagal(salah, label) {
  if (salah) {
    console.error(`Gagal ${label}:`, salah.message);
    process.exit(1);
  }
}

const negara = [
  { kode: "ID", nama: "Indonesia", mata_uang: "IDR", urutan: 1 },
  { kode: "TH", nama: "Thailand", mata_uang: "THB", urutan: 2 },
  { kode: "KR", nama: "Korea Selatan", mata_uang: "KRW", urutan: 3 },
  { kode: "CN", nama: "China", mata_uang: "CNY", urutan: 4 },
  { kode: "JP", nama: "Jepang", mata_uang: "JPY", urutan: 5 },
];

const komponen = [
  { id: "id-lokal", country_kode: "ID", nama: "GO Lokal", deskripsi: "Split barang yang sudah ada di Indonesia.", urutan: 1 },
  { id: "th-album", country_kode: "TH", nama: "Album & Merch", deskripsi: "Album dan merch resmi dari toko Thailand.", urutan: 1 },
  { id: "kr-album", country_kode: "KR", nama: "Album", deskripsi: "Album dari toko resmi Korea, termasuk po benefit.", urutan: 1 },
  { id: "cn-album", country_kode: "CN", nama: "Album", deskripsi: "Album versi China dari platform resmi.", urutan: 1 },
  { id: "jp-merch", country_kode: "JP", nama: "Merch", deskripsi: "Merch resmi dari Jepang.", urutan: 1 },
];

const batch = {
  id: "cn-album-batch-1",
  component_id: "cn-album",
  nama: "Batch 1 (Contoh)",
  slug: "cn-album-batch-1",
  buka_po: "2026-09-25",
  tutup_po: "2026-10-10",
  kurs_go: 2450,
  ongkir_lokal: 15000,
  ongkir_internasional: 25000,
  fee_organizer: 5000,
  status: "po_dibuka",
  catatan: "Ini batch contoh biar kelihatan bentuk halamannya. Hapus dan ganti dengan batch asli lewat Table Editor.",
};

const items = [
  { id: "cn-album-b1-s", batch_id: "cn-album-batch-1", nama: "[Contoh] Album ver. S", harga_lokal: 128, kuota: 20, terisi: 7, urutan: 1 },
  { id: "cn-album-b1-w", batch_id: "cn-album-batch-1", nama: "[Contoh] Album ver. W", harga_lokal: 128, kuota: 20, terisi: 3, urutan: 2 },
];

const tracking = [
  { batch_id: "cn-album-batch-1", status: "po_dibuka", catatan: "PO dibuka, kuota 20 slot per versi.", tanggal: "2026-09-25" },
  { batch_id: "cn-album-batch-1", status: "po_dibuka", catatan: "Kurs GO fix di 1 CNY = Rp2.450 sampai PO tutup.", tanggal: "2026-09-26" },
];

const reviews = [
  { batch_id: "cn-album-batch-1", nama: "Buyer Contoh", bintang: 5, teks: "[Contoh] Barang sampai aman, packing rapi banget. Ganti dengan review asli buyer.", tanggal: "2026-09-30", tampil: true },
  { batch_id: "cn-album-batch-1", nama: "Buyer Contoh 2", bintang: 4, teks: "[Contoh] Prosesnya cepat, admin ramah. Review asli menggantikan contoh ini.", tanggal: "2026-10-01", tampil: true },
];

const order = {
  kode: "PF-CN-B1-7K3QD",
  buyer_username: "contohbuyer",
  wa_last4: "1234",
  batch_id: "cn-album-batch-1",
  status: "menunggu_verifikasi",
  total_rp: 359000,
  catatan: null,
  created_at: "2026-09-26T09:00:00Z",
};

await cekGagal((await sb.from("countries").upsert(negara)).error, "upsert countries");
await cekGagal((await sb.from("components").upsert(komponen)).error, "upsert components");
await cekGagal((await sb.from("batches").upsert(batch)).error, "upsert batches");
await cekGagal((await sb.from("batch_items").upsert(items)).error, "upsert batch_items");

await sb.from("tracking_updates").delete().eq("batch_id", batch.id);
await cekGagal((await sb.from("tracking_updates").insert(tracking)).error, "insert tracking");

await sb.from("reviews").delete().eq("batch_id", batch.id);
await cekGagal((await sb.from("reviews").insert(reviews)).error, "insert reviews");

const { data: lama } = await sb.from("orders").select("id").eq("kode", order.kode);
if (lama && lama.length > 0) {
  await sb.from("order_items").delete().in("order_id", lama.map((o) => o.id));
  await sb.from("orders").delete().eq("kode", order.kode);
}
const { data: dibuat, error: eOrder } = await sb.from("orders").insert(order).select("id").single();
await cekGagal(eOrder, "insert orders");
await cekGagal((await sb.from("order_items").insert({ item_id: "cn-album-b1-s", order_id: dibuat.id, qty: 1, harga_satuan_rp: 314000 })).error, "insert order_items");

console.log("Seed selesai. Isi tabel:");
for (const t of ["countries", "components", "batches", "batch_items", "tracking_updates", "orders", "order_items", "reviews", "profiles"]) {
  const { count } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(`  ${t}: ${count ?? 0} baris`);
}
