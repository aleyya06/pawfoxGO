"use server";

import { kirimReview } from "@/lib/db";

export interface HasilReview {
  ok: boolean;
  pesan: string;
}

export async function aksiKirimReview(_state: HasilReview | null, formData: FormData): Promise<HasilReview> {
  const nama = String(formData.get("nama") ?? "").trim();
  const batchId = String(formData.get("batchId") ?? "").trim();
  const bintang = Number(formData.get("bintang") ?? 0);
  const teks = String(formData.get("teks") ?? "").trim();

  if (!nama || nama.length > 60) return { ok: false, pesan: "Isi namamu dulu (maksimal 60 huruf)." };
  if (!batchId) return { ok: false, pesan: "Pilih batch yang mau kamu review." };
  if (!Number.isInteger(bintang) || bintang < 1 || bintang > 5) return { ok: false, pesan: "Pilih bintang 1 sampai 5." };
  if (teks.length < 5 || teks.length > 500) return { ok: false, pesan: "Ceritamu 5 sampai 500 huruf, ya." };

  try {
    await kirimReview({ batchId, nama, bintang, teks });
    return { ok: true, pesan: "Terima kasih! Reviewmu masuk dan akan tampil setelah dicek admin." };
  } catch {
    return { ok: false, pesan: "Gagal mengirim sekarang. Coba lagi sebentar lagi, ya." };
  }
}
