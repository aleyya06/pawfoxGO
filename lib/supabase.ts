import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let klien: SupabaseClient | null = null;

// Semua akses database jalan di server dan memakai secret key, jadi tabel
// tidak perlu kebijakan RLS selama tidak ada kunci yang bocor ke browser.
export function supabase(): SupabaseClient {
  if (!klien) {
    const url = process.env.SUPABASE_URL;
    const kunci = process.env.SUPABASE_SECRET_KEY;
    if (!url || !kunci || !url.startsWith("https://")) {
      throw new Error(
        "SUPABASE_URL / SUPABASE_SECRET_KEY belum terisi dengan benar di .env.local (URL harus bentuk https://xxxx.supabase.co)"
      );
    }
    klien = createClient(url, kunci, { auth: { persistSession: false } });
  }
  return klien;
}
