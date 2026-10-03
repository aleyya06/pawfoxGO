import type { Metadata } from "next";
import KartuPesanan from "@/components/KartuPesanan";
import { pesananByKodeDb, pesananByUsernameDb } from "@/lib/db";
import { KONTAK } from "@/lib/data";

export const metadata: Metadata = { title: "Cek Pesanan" };
export const dynamic = "force-dynamic";

export default async function HalamanCekPesanan({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; digit?: string }>;
}) {
  const { q, digit } = await searchParams;
  const query = (q ?? "").trim();
  const digitMasuk = (digit ?? "").trim();

  let konten;
  if (!query) {
    konten = (
      <p className="po-kartu-meta">
        Punya kode order? Ketik kodenya untuk lihat detail lengkap. Cuma ingat username? Ketik usernamemu, lalu
        konfirmasi 4 digit terakhir nomor WA buat buka detailnya.
      </p>
    );
  } else {
    try {
      const pesanan = await pesananByKodeDb(query);
      if (pesanan) {
        konten = (
          <>
            <KartuPesanan pesanan={pesanan} lengkap />
            <p className="po-kartu-meta">Simpan kode order ini, bisa dipakai kapan aja di halaman ini.</p>
          </>
        );
      } else {
        const daftar = await pesananByUsernameDb(query);
        if (daftar.length === 0) {
          konten = (
            <div className="kosong">
              <p>Nggak ketemu nih. Cek lagi ejaan kode order atau username-nya.</p>
              <p>
                Masih bingung? Hubungi admin di{" "}
                <a href={KONTAK.x} target="_blank" rel="noreferrer">
                  {KONTAK.xHandle}
                </a>
                .
              </p>
            </div>
          );
        } else {
          const sudahVerifikasi = daftar.every((p) => p.waDigit && p.waDigit === digitMasuk);
          konten = (
            <div className="hasil-buyer">
              <p className="po-kartu-meta">
                Ditemukan {daftar.length} pesanan atas username <strong>{query}</strong>.
              </p>
              {daftar.map((p) => (
                <KartuPesanan key={p.id} pesanan={p} lengkap={sudahVerifikasi} />
              ))}
              {!sudahVerifikasi && (
                <form method="get" className="kartu verif-box">
                  <input type="hidden" name="q" value={query} />
                  <div className="kalk-field">
                    <label htmlFor="digit">4 digit terakhir nomor WA kamu</label>
                    <input
                      id="digit"
                      name="digit"
                      className="kalk-input cek-input-digit"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="off"
                    />
                  </div>
                  <button type="submit" className="tombol">
                    Buka detail
                  </button>
                  {digitMasuk && <p className="kurs-status gagal">4 digit nggak cocok, coba lagi.</p>}
                </form>
              )}
            </div>
          );
        }
      }
    } catch {
      konten = (
        <p className="kosong">Ada gangguan waktu mencari pesanan. Coba lagi sebentar, kalau masih error hubungi admin.</p>
      );
    }
  }

  return (
    <div className="wadah">
      <h1>Cek Pesanan</h1>
      <p className="bagian-pengantar">Tanpa perlu login: cari pakai kode order atau username yang kamu pakai waktu order.</p>
      <form method="get" className="cek-form" role="search">
        <div className="kalk-field">
          <label htmlFor="q">Kode order atau username</label>
          <input
            id="q"
            name="q"
            className="kalk-input cek-input"
            type="text"
            autoComplete="off"
            defaultValue={query}
            placeholder="PF-... atau username"
          />
        </div>
        <button type="submit" className="tombol">
          Cari
        </button>
      </form>
      <div className="cek-hasil" aria-live="polite">
        {konten}
      </div>
    </div>
  );
}
