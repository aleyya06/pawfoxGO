import type { Metadata } from "next";
import Link from "next/link";
import Bendera from "@/components/Bendera";
import KalkulatorKurs from "@/components/KalkulatorKurs";
import RateLiveSingkat from "@/components/RateLiveSingkat";
import { KONTAK } from "@/lib/data";
import { formatRupiah } from "@/lib/format";
import { muatKatalog } from "@/lib/db";
import { masihBuka, negaraBatch } from "@/lib/tampilan";

export const metadata: Metadata = { title: "Kalkulator Kurs" };
export const dynamic = "force-dynamic";

export default async function HalamanKalkulator() {
  // Kalkulator tetap jalan walau katalog gagal dimuat; daftar rate GO saja yang kosong.
  const katalog = await muatKatalog().catch(() => null);
  const sekarang = Date.now();
  const buka = katalog
    ? katalog.batchList
        .filter((b) => masihBuka(b, sekarang))
        .map((b) => ({ batch: b, negara: katalog.negaraList.find((n) => n.kode === negaraBatch(katalog, b)) }))
        .filter((x) => x.negara && x.negara.mataUang !== "IDR")
    : [];

  return (
    <div className="wadah halaman">
      <header className="kepala-halaman">
        <h1>Kalkulator Kurs</h1>
        <p className="bagian-pengantar">
          Konversi Won, Yuan, Baht, dan Yen ke rupiah (dan sebaliknya) dengan rate live, lalu bandingkan dengan rate GO
          batch yang lagi buka.
        </p>
      </header>

      <div className="kalkulator-grid">
        <KalkulatorKurs judul={false} />

        <section className="rate-go" aria-labelledby="judul-kurs-go">
          <h2 id="judul-kurs-go">Rate GO batch yang lagi buka</h2>
          <p className="catatan-kecil">
            Rate live berganti tiap hari. Tagihanmu selalu dihitung pakai rate GO batch, yang dikunci sejak batch dibuka.
          </p>
          {katalog === null ? (
            <p className="kosong">Katalog batch gagal dimuat, jadi rate GO belum bisa ditampilkan. Coba muat ulang halaman.</p>
          ) : buka.length === 0 ? (
            <p className="kosong">
              Belum ada batch luar negeri yang buka. Pengumuman PO baru lewat{" "}
              <a href={KONTAK.x} target="_blank" rel="noreferrer">
                {KONTAK.xHandle}
              </a>
              .
            </p>
          ) : (
            <ul className="daftar-rate-go">
              {buka.map(({ batch, negara }) => (
                <li key={batch.id}>
                  <p className="rate-go-angka mono">
                    <Bendera kode={negara!.kode} />1 {negara!.mataUang} = {formatRupiah(batch.kursGo)}
                  </p>
                  <RateLiveSingkat kode={negara!.mataUang} />
                  <p className="rate-go-batch">
                    {batch.nama} · <Link href={`/po/${batch.slug}`}>lihat batch</Link>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
