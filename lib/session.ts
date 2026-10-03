import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const NAMA_COOKIE = "pawfox_sesi";
const UMUR_DETIK = 60 * 60 * 24 * 30;

function rahasia(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET belum diisi di .env.local");
  return s;
}

function tanda(isi: string): string {
  return createHmac("sha256", rahasia()).update(isi).digest("hex");
}

export async function simpanSesi(profileId: string): Promise<void> {
  const kedaluwarsa = Date.now() + UMUR_DETIK * 1000;
  const isi = `${profileId}.${kedaluwarsa}`;
  const cookieStore = await cookies();
  cookieStore.set(NAMA_COOKIE, `${isi}.${tanda(isi)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: UMUR_DETIK,
    secure: (process.env.APP_URL ?? "").startsWith("https://"),
  });
}

export async function hapusSesi(): Promise<void> {
  (await cookies()).delete(NAMA_COOKIE);
}

export async function profilIdSesi(): Promise<string | null> {
  const c = (await cookies()).get(NAMA_COOKIE)?.value;
  if (!c) return null;
  const [id, kedaluwarsa, ttd] = c.split(".");
  if (!id || !kedaluwarsa || !ttd) return null;
  const harapan = Buffer.from(tanda(`${id}.${kedaluwarsa}`));
  const diterima = Buffer.from(ttd);
  if (harapan.length !== diterima.length || !timingSafeEqual(harapan, diterima)) return null;
  if (Number(kedaluwarsa) < Date.now()) return null;
  return id;
}
