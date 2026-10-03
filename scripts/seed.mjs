// Seed data awal ke Supabase. Jalankan: node --env-file=.env.local scripts/seed.mjs
// Isinya disamakan dengan lib/katalog-cadangan.ts (jaga keduanya sinkron).
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

const batches = [
  {
    id: "cn-album-batch-1", component_id: "cn-album", nama: "Album China Batch 1", slug: "cn-album-batch-1",
    buka_po: "2026-09-25", tutup_po: "2026-10-10", kurs_go: 2450,
    ongkir_lokal: 15000, ongkir_internasional: 25000, fee_organizer: 5000,
    status: "po_dibuka", catatan: "Kurs GO fix di 1 CNY = Rp2.450 sampai PO tutup.",
  },
  {
    id: "th-album-batch-2", component_id: "th-album", nama: "Album Thailand Batch 2", slug: "th-album-batch-2",
    buka_po: "2026-09-28", tutup_po: "2026-10-15", kurs_go: 480,
    ongkir_lokal: 18000, ongkir_internasional: 30000, fee_organizer: 5000,
    status: "po_dibuka", catatan: "Pengiriman dari Bangkok sekitar 3 minggu setelah PO tutup.",
  },
  {
    id: "th-merch-batch-1", component_id: "th-album", nama: "Merch Thailand Batch 1", slug: "th-merch-batch-1",
    buka_po: "2026-08-10", tutup_po: "2026-08-25", kurs_go: 470,
    ongkir_lokal: 18000, ongkir_internasional: 30000, fee_organizer: 5000,
    status: "tiba_indonesia", catatan: null,
  },
  {
    id: "kr-album-batch-5", component_id: "kr-album", nama: "Album Korea Batch 5", slug: "kr-album-batch-5",
    buka_po: "2026-09-01", tutup_po: "2026-09-20", kurs_go: 12,
    ongkir_lokal: 12000, ongkir_internasional: 28000, fee_organizer: 5000,
    status: "berangkat", catatan: null,
  },
  {
    id: "jp-merch-batch-2", component_id: "jp-merch", nama: "Merch Jepang Batch 2", slug: "jp-merch-batch-2",
    buka_po: "2026-08-05", tutup_po: "2026-08-30", kurs_go: 108,
    ongkir_lokal: 16000, ongkir_internasional: 32000, fee_organizer: 5000,
    status: "sorting", catatan: null,
  },
  {
    id: "id-lokal-batch-1", component_id: "id-lokal", nama: "Split GO Lokal Batch 1", slug: "id-lokal-batch-1",
    buka_po: "2026-09-15", tutup_po: "2026-10-05", kurs_go: 1,
    ongkir_lokal: 10000, ongkir_internasional: 0, fee_organizer: 5000,
    status: "po_dibuka", catatan: "Barang ready di tangan, tinggal split ongkir domestik.",
  },
];

const items = [
  { id: "cn-album-b1-s", batch_id: "cn-album-batch-1", nama: "Album ver. S", harga_lokal: 128, kuota: 20, terisi: 12, urutan: 1 },
  { id: "cn-album-b1-w", batch_id: "cn-album-batch-1", nama: "Album ver. W", harga_lokal: 128, kuota: 20, terisi: 8, urutan: 2 },
  { id: "th-album-b2-j", batch_id: "th-album-batch-2", nama: "Album TH ver. J", harga_lokal: 850, kuota: 15, terisi: 6, urutan: 1 },
  { id: "th-album-b2-pc", batch_id: "th-album-batch-2", nama: "Official Photocard Set", harga_lokal: 320, kuota: 25, terisi: 18, urutan: 2 },
  { id: "th-merch-b1-plush", batch_id: "th-merch-batch-1", nama: "Plush Doll 25cm", harga_lokal: 690, kuota: 10, terisi: 10, urutan: 1 },
  { id: "th-merch-b1-tote", batch_id: "th-merch-batch-1", nama: "Tote Bag Limited", harga_lokal: 450, kuota: 15, terisi: 9, urutan: 2 },
  { id: "kr-album-b5-rand", batch_id: "kr-album-batch-5", nama: "Album ver. Random", harga_lokal: 16800, kuota: 30, terisi: 27, urutan: 1 },
  { id: "kr-album-b5-pob", batch_id: "kr-album-batch-5", nama: "POB Photocard", harga_lokal: 3500, kuota: 30, terisi: 21, urutan: 2 },
  { id: "jp-merch-b2-mag", batch_id: "jp-merch-batch-2", nama: "Official Fan Magazine Vol. 9", harga_lokal: 2200, kuota: 12, terisi: 11, urutan: 1 },
  { id: "jp-merch-b2-acs", batch_id: "jp-merch-batch-2", nama: "Acrylic Stand", harga_lokal: 1650, kuota: 12, terisi: 7, urutan: 2 },
  { id: "id-lokal-b1-slot", batch_id: "id-lokal-batch-1", nama: "Album Split Slot", harga_lokal: 145000, kuota: 10, terisi: 4, urutan: 1 },
  { id: "id-lokal-b1-pc", batch_id: "id-lokal-batch-1", nama: "Photocard Random", harga_lokal: 25000, kuota: 20, terisi: 13, urutan: 2 },
];

const tracking = [
  { batch_id: "cn-album-batch-1", status: "po_dibuka", catatan: "PO dibuka, kuota 20 slot per versi.", tanggal: "2026-09-25" },
  { batch_id: "cn-album-batch-1", status: "po_dibuka", catatan: "Slot ver. S udah setengah terisi.", tanggal: "2026-10-01" },
  { batch_id: "th-album-batch-2", status: "po_dibuka", catatan: "PO dibuka, kurs fix 1 THB = Rp480.", tanggal: "2026-09-28" },
  { batch_id: "th-merch-batch-1", status: "po_dibuka", catatan: "PO dibuka untuk merch limited.", tanggal: "2026-08-10" },
  { batch_id: "th-merch-batch-1", status: "po_ditutup", catatan: "PO tutup, plush doll full slot.", tanggal: "2026-08-25" },
  { batch_id: "th-merch-batch-1", status: "warehouse_asal", catatan: "Semua barang sampai warehouse Bangkok.", tanggal: "2026-09-05" },
  { batch_id: "th-merch-batch-1", status: "berangkat", catatan: "Berangkat via kargo udara.", tanggal: "2026-09-18" },
  { batch_id: "th-merch-batch-1", status: "tiba_indonesia", catatan: "Sampai Jakarta, lagi proses bea cukai.", tanggal: "2026-10-01" },
  { batch_id: "kr-album-batch-5", status: "po_dibuka", catatan: "PO dibuka, kurs fix 1 KRW = Rp12.", tanggal: "2026-09-01" },
  { batch_id: "kr-album-batch-5", status: "po_ditutup", catatan: "PO tutup, 27/30 slot album terisi.", tanggal: "2026-09-20" },
  { batch_id: "kr-album-batch-5", status: "produksi", catatan: "Menunggu rilis resmi album.", tanggal: "2026-09-22" },
  { batch_id: "kr-album-batch-5", status: "warehouse_asal", catatan: "Barang lengkap sampai warehouse Korea.", tanggal: "2026-09-29" },
  { batch_id: "kr-album-batch-5", status: "berangkat", catatan: "Berangkat dari Incheon.", tanggal: "2026-10-02" },
  { batch_id: "jp-merch-batch-2", status: "po_dibuka", catatan: "PO dibuka untuk fan magazine vol. 9.", tanggal: "2026-08-05" },
  { batch_id: "jp-merch-batch-2", status: "po_ditutup", catatan: "PO tutup tepat waktu.", tanggal: "2026-08-30" },
  { batch_id: "jp-merch-batch-2", status: "warehouse_asal", catatan: "Sampai warehouse Tokyo.", tanggal: "2026-09-12" },
  { batch_id: "jp-merch-batch-2", status: "berangkat", catatan: "Berangkat via kargo laut+jalur cepat.", tanggal: "2026-09-20" },
  { batch_id: "jp-merch-batch-2", status: "tiba_indonesia", catatan: "Tiba di Jakarta dan lolos bea cukai.", tanggal: "2026-10-01" },
  { batch_id: "jp-merch-batch-2", status: "sorting", catatan: "Sorting per nama buyer di warehouse lokal.", tanggal: "2026-10-03" },
  { batch_id: "id-lokal-batch-1", status: "po_dibuka", catatan: "Split dibuka, barang ready stock.", tanggal: "2026-09-15" },
];

const reviews = [
  { batch_id: "th-merch-batch-1", nama: "Nayla", bintang: 5, teks: "Plush doll-nya sampai dalam kondisi sempurna, dibungkus bubble wrap berlapis. Admin sabar jawab pertanyaan.", tanggal: "2026-09-30", tampil: true },
  { batch_id: "kr-album-batch-5", nama: "Rara", bintang: 4, teks: "Update tracking-nya rajin, jadi nggak perlu nanya-nanya. Minus dikit di jadwal yang geser, tapi aman.", tanggal: "2026-10-01", tampil: true },
];

const order = {
  kode: "PF-CN-B1-7K3QD",
  buyer_username: "buyerperdana",
  wa_last4: "1234",
  batch_id: "cn-album-batch-1",
  status: "menunggu_verifikasi",
  total_rp: 359000,
  catatan: null,
  created_at: "2026-09-26T09:00:00Z",
};

await cekGagal((await sb.from("countries").upsert(negara)).error, "upsert countries");
await cekGagal((await sb.from("components").upsert(komponen)).error, "upsert components");
await cekGagal((await sb.from("batches").upsert(batches)).error, "upsert batches");
await cekGagal((await sb.from("batch_items").upsert(items)).error, "upsert batch_items");

await sb.from("tracking_updates").delete().in("batch_id", batches.map((b) => b.id));
await cekGagal((await sb.from("tracking_updates").insert(tracking)).error, "insert tracking");

const { data: reviewLama } = await sb.from("reviews").select("id").in("batch_id", batches.map((b) => b.id));
if (reviewLama && reviewLama.length > 0) {
  await sb.from("reviews").delete().in("id", reviewLama.map((r) => r.id));
}
await cekGagal((await sb.from("reviews").insert(reviews)).error, "insert reviews");

const { data: orderLama } = await sb.from("orders").select("id").eq("kode", order.kode);
if (orderLama && orderLama.length > 0) {
  await sb.from("order_items").delete().in("order_id", orderLama.map((o) => o.id));
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
