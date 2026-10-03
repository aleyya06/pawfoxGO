"use server";

import { redirect } from "next/navigation";
import { buatPesanan, profilSesi, tambahTracking, toggleTampilReview, ubahStatusPesanan } from "@/lib/db";
import type { StatusPesanan, StatusTracking } from "@/lib/data";

async function wajibAdmin() {
  const sesi = await profilSesi();
  if (!sesi || !sesi.isAdmin) redirect("/masuk");
  return sesi;
}

export async function aksiBuatTagihan(formData: FormData) {
  await wajibAdmin();
  const batchId = String(formData.get("batchId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const qty = Math.max(1, Number(formData.get("qty") ?? 1) || 1);
  const profilId = String(formData.get("profilId") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const waLast4 = String(formData.get("waLast4") ?? "").replace(/\D/g, "").slice(0, 4);
  const catatan = String(formData.get("catatan") ?? "").trim();

  if (!batchId || !itemId) redirect("/admin?galat=tagihan");
  if (!profilId && (!username || waLast4.length !== 4)) redirect("/admin?galat=buyer");

  try {
    await buatPesanan({
      batchId,
      itemId,
      qty,
      profilId: profilId || null,
      username: username || null,
      waLast4: waLast4 || null,
      catatan: catatan || null,
    });
  } catch {
    redirect("/admin?galat=tagihan");
  }
  redirect("/admin?sukses=tagihan");
}

export async function aksiStatusPesanan(formData: FormData) {
  await wajibAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as StatusPesanan;
  const boleh: StatusPesanan[] = ["menunggu_bayar", "menunggu_verifikasi", "lunas", "dibatalkan", "refund"];
  if (!orderId || !boleh.includes(status)) redirect("/admin?galat=status");
  try {
    await ubahStatusPesanan(orderId, status);
  } catch {
    redirect("/admin?galat=status");
  }
  redirect("/admin?sukses=status");
}

export async function aksiTambahTracking(formData: FormData) {
  await wajibAdmin();
  const batchId = String(formData.get("batchId") ?? "");
  const status = String(formData.get("status") ?? "") as StatusTracking;
  const catatan = String(formData.get("catatan") ?? "").trim();
  const tanggal = String(formData.get("tanggal") ?? "").trim() || new Date().toISOString().slice(0, 10);
  if (!batchId || !status) redirect("/admin?galat=tracking");
  try {
    await tambahTracking(batchId, status, catatan, tanggal);
  } catch {
    redirect("/admin?galat=tracking");
  }
  redirect("/admin?sukses=tracking");
}

export async function aksiToggleReview(formData: FormData) {
  await wajibAdmin();
  const reviewId = Number(formData.get("reviewId") ?? 0);
  const tampil = String(formData.get("tampil") ?? "") === "1";
  if (!reviewId) redirect("/admin?galat=review");
  try {
    await toggleTampilReview(reviewId, !tampil);
  } catch {
    redirect("/admin?galat=review");
  }
  redirect("/admin?sukses=review");
}
