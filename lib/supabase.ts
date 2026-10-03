import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let klien: SupabaseClient | null = null;

// Semua akses database jalan di server dan memakai secret key, jadi tabel
// tidak perlu kebijakan RLS selama tidak ada kunci yang bocor ke browser.
function supabase(): SupabaseClient {
  if (!klien) {
    const url = process.env.SUPABASE_URL;
    const kunci = process.env.SUPABASE_SECRET_KEY;
    if (!url || !kunci || !url.startsWith("https://")) {
      throw new Error(
        "SUPABASE_URL / SUPABASE_SECRET_KEY belum terisi dengan benar di .env.local (URL harus bentuk https://xxxx.supabase.co)"
      );
    }
    // DNS atau jaringan bermasalah tidak boleh menggantung halaman: setiap
    // permintaan dipotong di 5 detik, fallback katalog yang lanjut.
    const fetchBatasWaktu: typeof fetch = (input, init) =>
      fetch(input, { ...init, signal: AbortSignal.timeout(5000) });
    klien = createClient(url, kunci, { auth: { persistSession: false }, global: { fetch: fetchBatasWaktu } });
  }
  return klien;
}

export function tandaiGagal(): void {
  (globalThis as { __pawfoxGagalSampai?: number }).__pawfoxGagalSampai = Date.now() + 10 * 60_000;
}

// Pintu masuk untuk semua akses database: kalau Supabase baru saja gagal,
// langsung dilempar tanpa nunggu timeout DNS, pemanggil pakai cadangan.
export function supabaseSiap(): SupabaseClient {
  const gagalSampai = (globalThis as { __pawfoxGagalSampai?: number }).__pawfoxGagalSampai ?? 0;
  if (Date.now() < gagalSampai) {
    throw new Error("Supabase baru saja gagal dihubungi, sementara memakai data cadangan");
  }
  return supabase();
}
