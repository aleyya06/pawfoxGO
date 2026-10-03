import { supabase } from "./supabase";
import { profilIdSesi } from "./session";
import { biayaPerSlot, hargaRupiah, type Batch, type Komponen, type Negara, type Pesanan, type Profil, type Review, type StatusPesanan, type StatusTracking, type ItemBatch } from "./data";
import { batchCadangan, negaraCadangan, komponenCadangan, pesananCadangan, reviewCadangan } from "./katalog-cadangan";

export interface BatchLengkap {
  batch: Batch;
  komponen: Komponen;
  negara: Negara;
}

export interface Katalog {
  negaraList: Negara[];
  komponenList: Komponen[];
  batchList: Batch[];
  lengkap: (batchId: string) => BatchLengkap | undefined;
}

interface BarisNegara {
  kode: string;
  nama: string;
  mata_uang: string;
  urutan: number;
}

interface BarisKomponen {
  id: string;
  country_kode: string;
  nama: string;
  deskripsi: string | null;
  urutan: number;
}

interface BarisBatch {
  id: string;
  component_id: string;
  nama: string;
  slug: string;
  buka_po: string;
  tutup_po: string;
  kurs_go: number;
  ongkir_lokal: number;
  ongkir_internasional: number;
  fee_organizer: number;
  status: string;
  catatan: string | null;
}

interface BarisItem {
  id: string;
  batch_id: string;
  nama: string;
  harga_lokal: number;
  kuota: number;
  terisi: number;
  urutan: number;
}

interface BarisTracking {
  id: number;
  batch_id: string;
  status: string;
  catatan: string | null;
  tanggal: string;
}

interface BarisReview {
  id: number;
  batch_id: string;
  profile_id: string | null;
  nama: string;
  bintang: number;
  teks: string;
  tanggal: string;
  tampil: boolean;
}

interface BarisProfil {
  id: string;
  line_user_id: string;
  display_name: string;
  avatar_url: string | null;
  is_admin: boolean;
}

interface BarisOrder {
  id: string;
  kode: string;
  profile_id: string | null;
  buyer_username: string | null;
  wa_last4: string | null;
  batch_id: string;
  status: string;
  total_rp: number;
  catatan: string | null;
  created_at: string;
}

interface BarisOrderItem {
  id: number;
  order_id: string;
  item_id: string;
  qty: number;
  harga_satuan_rp: number;
}

// Pemutus sirkuit: kalau Supabase baru saja gagal, jangan coba lagi selama
// satu menit, langsung pakai cadangan supaya halaman tetap cepat.
let gagalSampai = 0;
const JEDA_GAGAL_MS = 10 * 60_000;

async function ambil<T>(tabel: string): Promise<T[]> {
  if (Date.now() < gagalSampai) {
    throw new Error("Supabase baru saja gagal dihubungi, sementara memakai data cadangan");
  }
  const { data, error } = await supabase().from(tabel).select("*");
  if (error) throw new Error(`Gagal membaca tabel ${tabel}: ${error.message}`);
  return (data ?? []) as T[];
}

function rangkaiKatalog(negaraList: Negara[], komponenList: Komponen[], batchList: Batch[]): Katalog {
  const komponenById = new Map(komponenList.map((k) => [k.id, k]));
  const negaraByKode = new Map(negaraList.map((n) => [n.kode, n]));

  function lengkap(batch: Batch): BatchLengkap {
    const komponen = komponenById.get(batch.komponenId);
    const negara = komponen ? negaraByKode.get(komponen.negara) : undefined;
    return {
      batch,
      komponen: komponen ?? { id: "", negara: "", nama: "Umum", deskripsi: "" },
      negara: negara ?? { kode: "ID", nama: "Indonesia", mataUang: "IDR" },
    };
  }

  return {
    negaraList,
    komponenList,
    batchList,
    lengkap: (batchId: string) => {
      const batch = batchList.find((b) => b.id === batchId);
      return batch ? lengkap(batch) : undefined;
    },
  };
}

export async function muatKatalog(): Promise<Katalog> {
  try {
    const [negaraRows, komponenRows, batchRows, itemRows, trackingRows] = await Promise.all([
      ambil<BarisNegara>("countries"),
      ambil<BarisKomponen>("components"),
      ambil<BarisBatch>("batches"),
      ambil<BarisItem>("batch_items"),
      ambil<BarisTracking>("tracking_updates"),
    ]);

    const negaraList: Negara[] = negaraRows
      .sort((a, b) => a.urutan - b.urutan)
      .map((r) => ({ kode: r.kode, nama: r.nama, mataUang: r.mata_uang as Negara["mataUang"] }));
    const komponenList: Komponen[] = komponenRows
      .sort((a, b) => a.urutan - b.urutan)
      .map((r) => ({ id: r.id, negara: r.country_kode, nama: r.nama, deskripsi: r.deskripsi ?? "" }));
    const batchList: Batch[] = batchRows.map((r) => ({
      id: r.id,
      komponenId: r.component_id,
      nama: r.nama,
      slug: r.slug,
      bukaPo: r.buka_po,
      tutupPo: r.tutup_po,
      kursGo: Number(r.kurs_go),
      ongkirLokal: r.ongkir_lokal,
      ongkirInternasional: r.ongkir_internasional,
      feeOrganizer: r.fee_organizer,
      status: r.status as Batch["status"],
      catatan: r.catatan ?? undefined,
      items: itemRows
        .filter((i) => i.batch_id === r.id)
        .sort((a, b) => a.urutan - b.urutan)
        .map((i) => ({ id: i.id, nama: i.nama, hargaLokal: Number(i.harga_lokal), kuota: i.kuota, terisi: i.terisi })),
      tracking: trackingRows
        .filter((t) => t.batch_id === r.id)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
        .map((t) => ({ status: t.status as StatusTracking, catatan: t.catatan ?? "", tanggal: t.tanggal })),
    }));

    return rangkaiKatalog(negaraList, komponenList, batchList);
  } catch (galatAsli) {
    // Supabase gagal dihubungi: tampilkan katalog contoh supaya halaman
    // publik tetap utuh. Bukan kondisi normal; perbaiki koneksi di .env.local.
    gagalSampai = Date.now() + JEDA_GAGAL_MS;
    console.error("Supabase tidak terjangkau, memakai katalog cadangan:", galatAsli instanceof Error ? galatAsli.message : galatAsli);
    return rangkaiKatalog(negaraCadangan, komponenCadangan, batchCadangan);
  }
}

export async function batchLengkapBySlug(slug: string): Promise<BatchLengkap | undefined> {
  const katalog = await muatKatalog();
  const batch = katalog.batchList.find((b) => b.slug === slug);
  return batch ? katalog.lengkap(batch.id) : undefined;
}

export async function reviewTampil(batchId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase()
      .from("reviews")
      .select("*")
      .eq("batch_id", batchId)
      .eq("tampil", true);
    if (error) throw new Error(`Gagal membaca review: ${error.message}`);
    return ((data ?? []) as BarisReview[])
      .map((r) => ({ id: r.id, batchId: r.batch_id, nama: r.nama, tanggal: r.tanggal, bintang: r.bintang, teks: r.teks }))
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  } catch {
    return reviewCadangan.filter((r) => r.batchId === batchId);
  }
}

export async function semuaReview(): Promise<(Review & { tampil: boolean })[]> {
  const rows = await ambil<BarisReview>("reviews");
  return rows
    .map((r) => ({ id: r.id, batchId: r.batch_id, nama: r.nama, tanggal: r.tanggal, bintang: r.bintang, teks: r.teks, tampil: r.tampil }))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export async function profilById(id: string): Promise<Profil | undefined> {
  const { data, error } = await supabase().from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Gagal membaca profil: ${error.message}`);
  if (!data) return undefined;
  const baris = data as BarisProfil;
  return { id: baris.id, nama: baris.display_name, avatarUrl: baris.avatar_url ?? undefined, isAdmin: baris.is_admin };
}

export async function profilSesi(): Promise<Profil | null> {
  const id = await profilIdSesi();
  if (!id) return null;
  return (await profilById(id)) ?? null;
}

export async function semuaProfil(): Promise<Profil[]> {
  const rows = await ambil<BarisProfil>("profiles");
  return rows.map((r) => ({ id: r.id, nama: r.display_name, avatarUrl: r.avatar_url ?? undefined, isAdmin: r.is_admin }));
}

// Setelah login LINE: cari profil berdasar id LINE, buat kalau belum ada.
// Login pertama di project yang belum punya admin otomatis jadi admin.
export async function upsertProfilLine(
  lineUserId: string,
  nama: string,
  avatarUrl: string | null
): Promise<{ profil: Profil; jadiAdmin: boolean }> {
  const sb = supabase();
  const { data: ada, error: errCari } = await sb.from("profiles").select("*").eq("line_user_id", lineUserId).maybeSingle();
  if (errCari) throw new Error(`Gagal mencari profil: ${errCari.message}`);
  if (ada) {
    const baris = ada as BarisProfil;
    await sb.from("profiles").update({ display_name: nama, avatar_url: avatarUrl }).eq("id", baris.id);
    return { profil: { id: baris.id, nama, avatarUrl: avatarUrl ?? undefined, isAdmin: baris.is_admin }, jadiAdmin: false };
  }
  const { count } = await sb.from("profiles").select("id", { count: "exact", head: true }).eq("is_admin", true);
  const jadiAdmin = (count ?? 0) === 0;
  const { data: baru, error: errBuat } = await sb
    .from("profiles")
    .insert({ line_user_id: lineUserId, display_name: nama, avatar_url: avatarUrl, is_admin: jadiAdmin })
    .select()
    .single();
  if (errBuat || !baru) throw new Error(`Gagal membuat profil: ${errBuat?.message ?? "tanpa data"}`);
  const baris = baru as BarisProfil;
  return { profil: { id: baris.id, nama: baris.display_name, avatarUrl: baris.avatar_url ?? undefined, isAdmin: baris.is_admin }, jadiAdmin };
}

async function susunPesanan(barisOrders: BarisOrder[]): Promise<Pesanan[]> {
  if (barisOrders.length === 0) return [];
  const [itemRows, orderItemRows, batchRows, profilRows] = await Promise.all([
    ambil<BarisItem>("batch_items"),
    ambil<BarisOrderItem>("order_items"),
    ambil<BarisBatch>("batches"),
    ambil<BarisProfil>("profiles"),
  ]);
  const batchById = new Map(batchRows.map((b) => [b.id, b]));
  const itemNama = new Map(itemRows.map((i) => [i.id, i.nama]));
  const profilById = new Map(profilRows.map((p) => [p.id, p]));

  return barisOrders
    .map((o) => {
      const batch = batchById.get(o.batch_id);
      const profil = o.profile_id ? profilById.get(o.profile_id) : undefined;
      return {
        id: o.id,
        kode: o.kode,
        buyerLabel: profil ? profil.display_name : (o.buyer_username ?? "Buyer"),
        batchId: o.batch_id,
        batchNama: batch?.nama ?? "Batch",
        batchSlug: batch?.slug ?? "",
        items: orderItemRows
          .filter((oi) => oi.order_id === o.id)
          .map((oi) => ({ nama: itemNama.get(oi.item_id) ?? "Item", qty: oi.qty, hargaSatuanRp: oi.harga_satuan_rp })),
        totalRp: o.total_rp,
        status: o.status as StatusPesanan,
        dibuat: o.created_at.slice(0, 10),
        waDigit: o.wa_last4 ?? undefined,
        catatan: o.catatan ?? undefined,
      };
    })
    .sort((a, b) => b.dibuat.localeCompare(a.dibuat));
}

export async function pesananProfil(profileId: string): Promise<Pesanan[]> {
  const { data, error } = await supabase().from("orders").select("*").eq("profile_id", profileId);
  if (error) throw new Error(`Gagal membaca pesanan: ${error.message}`);
  return susunPesanan((data ?? []) as BarisOrder[]);
}

export async function pesananByKodeDb(kode: string): Promise<Pesanan | undefined> {
  try {
    const { data, error } = await supabase().from("orders").select("*").eq("kode", kode.trim()).maybeSingle();
    if (error) throw new Error(`Gagal mencari pesanan: ${error.message}`);
    if (!data) return undefined;
    const [hasil] = await susunPesanan([data as BarisOrder]);
    return hasil;
  } catch {
    return pesananCadangan.find((p) => p.kode.toLowerCase() === kode.trim().toLowerCase());
  }
}

export async function pesananByUsernameDb(username: string): Promise<Pesanan[]> {
  try {
    const { data, error } = await supabase()
      .from("orders")
      .select("*")
      .ilike("buyer_username", username.trim());
    if (error) throw new Error(`Gagal mencari pesanan: ${error.message}`);
    return susunPesanan((data ?? []) as BarisOrder[]);
  } catch {
    const q = username.trim().toLowerCase();
    return pesananCadangan.filter((p) => p.buyerLabel.toLowerCase() === q);
  }
}

export async function semuaPesanan(): Promise<Pesanan[]> {
  return susunPesanan(await ambil<BarisOrder>("orders"));
}

function kodeAcak(panjang: number): string {
  const abjad = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let hasil = "";
  for (let i = 0; i < panjang; i++) {
    hasil += abjad[Math.floor(Math.random() * abjad.length)];
  }
  return hasil;
}

export async function buatPesanan(input: {
  batchId: string;
  itemId: string;
  qty: number;
  profilId?: string | null;
  username?: string | null;
  waLast4?: string | null;
  catatan?: string | null;
}): Promise<string> {
  const katalog = await muatKatalog();
  const batch = katalog.batchList.find((b) => b.id === input.batchId);
  if (!batch) throw new Error("Batch tidak ditemukan");
  const item = batch.items.find((i) => i.id === input.itemId);
  if (!item) throw new Error("Item tidak ditemukan");
  const info = katalog.lengkap(batch.id)!;
  const kode = `PF-${info.negara.kode}-${kodeAcak(6)}`;
  const hargaSatuan = hargaRupiah(item.hargaLokal, batch.kursGo);
  const total = hargaSatuan * input.qty + biayaPerSlot(batch) * input.qty;

  const { data: order, error: errOrder } = await supabase()
    .from("orders")
    .insert({
      kode,
      profile_id: input.profilId ?? null,
      buyer_username: input.username ?? null,
      wa_last4: input.waLast4 ?? null,
      batch_id: batch.id,
      status: "menunggu_bayar",
      total_rp: total,
      catatan: input.catatan ?? null,
    })
    .select("id")
    .single();
  if (errOrder || !order) throw new Error(`Gagal membuat tagihan: ${errOrder?.message ?? "tanpa data"}`);

  const { error: errItem } = await supabase()
    .from("order_items")
    .insert({ order_id: order.id, item_id: item.id, qty: input.qty, harga_satuan_rp: hargaSatuan });
  if (errItem) throw new Error(`Gagal menyimpan item tagihan: ${errItem.message}`);
  return kode;
}

export async function ubahStatusPesanan(orderId: string, status: StatusPesanan): Promise<void> {
  const { error } = await supabase().from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(`Gagal mengubah status: ${error.message}`);
}

export async function tambahTracking(
  batchId: string,
  status: StatusTracking,
  catatan: string,
  tanggal: string
): Promise<void> {
  const { error } = await supabase().from("tracking_updates").insert({ batch_id: batchId, status, catatan, tanggal });
  if (error) throw new Error(`Gagal menambah update tracking: ${error.message}`);
  const { error: errBatch } = await supabase().from("batches").update({ status }).eq("id", batchId);
  if (errBatch) throw new Error(`Gagal memperbarui status batch: ${errBatch.message}`);
}

export async function toggleTampilReview(reviewId: number, tampil: boolean): Promise<void> {
  const { error } = await supabase().from("reviews").update({ tampil }).eq("id", reviewId);
  if (error) throw new Error(`Gagal mengubah review: ${error.message}`);
}

export type { ItemBatch };
