import type { Metadata } from "next";

export const metadata: Metadata = { title: "Masuk" };

const PESAN_ERROR: Record<string, string> = {
  konfigurasi: "Login belum bisa dipakai karena kunci LINE di pengaturan server belum lengkap.",
  state: "Sesi login kedaluwarsa atau tidak cocok. Coba lagi dari awal.",
  token: "LINE nggak mau ngasih token. Coba lagi, kalau masih gagal hubungi admin.",
  server:
    "Login sampai LINE berhasil, tapi penyimpanan profilmu terganggu (kemungkinan database server belum tersambung). Coba lagi, atau hubungi admin.",
};

export default async function HalamanMasuk({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; lanjut?: string }>;
}) {
  const { error, lanjut } = await searchParams;
  const tujuan = lanjut && lanjut.startsWith("/") && !lanjut.startsWith("//") ? lanjut : null;
  const tautanMasuk = tujuan ? `/api/auth/line/start?lanjut=${encodeURIComponent(tujuan)}` : "/api/auth/line/start";

  return (
    <div className="wadah halaman-sempit">
      <h1>Masuk</h1>
      {tujuan && <p className="note">Login dulu ya, abis itu kamu langsung dibawa ke halaman yang tadi dibuka.</p>}
      {error && PESAN_ERROR[error] && <p className="note">{PESAN_ERROR[error]}</p>}
      <a className="tombol tombol-line" href={tautanMasuk}>
        Lanjut dengan LINE
      </a>
    </div>
  );
}
