import type { Metadata } from "next";

export const metadata: Metadata = { title: "Masuk" };

const PESAN_ERROR: Record<string, string> = {
  konfigurasi: "Login belum bisa dipakai karena kunci LINE di pengaturan server belum lengkap.",
  state: "Sesi login kedaluwarsa atau tidak cocok. Coba lagi dari awal.",
  token: "LINE nggak mau ngasih token. Coba lagi, kalau masih gagal hubungi admin.",
  server: "Ada gangguan waktu proses masuk. Coba lagi.",
};

function tujuanAman(lanjut: string | undefined): string | null {
  if (!lanjut || !lanjut.startsWith("/") || lanjut.startsWith("//")) return null;
  return lanjut;
}

export default async function HalamanMasuk({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; lanjut?: string }>;
}) {
  const { error, lanjut } = await searchParams;
  const tujuan = tujuanAman(lanjut);
  const tautanMasuk = tujuan ? `/api/auth/line/start?lanjut=${encodeURIComponent(tujuan)}` : "/api/auth/line/start";

  return (
    <div className="wadah halaman-sempit">
      <h1>Masuk</h1>
      <p className="bagian-pengantar">
        Masuk pakai LINE biar tagihan, pesanan, dan katalog PO nempel ke akunmu sendiri. Tanpa password, cukup setuju
        sekali.
      </p>
      {tujuan && <p className="note">Login dulu ya, abis itu kamu langsung dibawa ke halaman yang tadi dibuka.</p>}
      {error && PESAN_ERROR[error] && <p className="note">{PESAN_ERROR[error]}</p>}
      <a className="tombol tombol-line" href={tautanMasuk}>
        Masuk dengan LINE
      </a>
      <p className="po-kartu-meta">
        Belum mau login? Tetap bisa <a href="/cek-pesanan">cek pesanan</a> pakai kode order atau username.
      </p>
    </div>
  );
}
