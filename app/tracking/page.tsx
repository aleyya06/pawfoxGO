import type { Metadata } from "next";
import Link from "next/link";
import Bendera from "@/components/Bendera";
import RelPosisi from "@/components/RelPosisi";
import StripNegara, { SEMUA } from "@/components/StripNegara";
import { KONTAK } from "@/lib/data";
import { formatTanggal } from "@/lib/format";
import { muatKatalog } from "@/lib/db";
import { masihBuka, negaraBatch, updateTerakhir } from "@/lib/tampilan";

export const metadata: Metadata = { title: "Tracking Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanTracking({ searchParams }: { searchParams: Promise<{ negara?: string }> }) {
  let katalog;
  try {
    katalog = await muatKatalog();
  } catch {
    return (
      <div className="wadah">
        <p className="kosong">Database belum tersambung. Cek `.env.local` lalu muat ulang halaman.</p>
      </div>
    );
  }

  const { negara: paramNegara } = await searchParams;
  const negaraAktif = katalog.negaraList.find((n) => n.kode === paramNegara?.toUpperCase());
  const aktif = negaraAktif?.kode ?? SEMUA;
  const sekarang = Date.now();

  const urut = [...katalog.batchList].sort((a, b) =>
    (updateTerakhir(b)?.tanggal ?? "").localeCompare(updateTerakhir(a)?.tanggal ?? "")
  );
  const tampil = negaraAktif ? urut.filter((b) => negaraBatch(katalog, b) === negaraAktif.kode) : urut;

  const pilihan = [
    { kode: SEMUA, nama: "Semua", jumlah: katalog.batchList.length },
    ...katalog.negaraList.map((n) => ({
      kode: n.kode,
      nama: n.nama,
      jumlah: katalog.batchList.filter((b) => negaraBatch(katalog, b) === n.kode).length,
    })),
  ];

  return (
    <div className="wadah halaman">
      <header className="kepala-halaman">
        <h1>Tracking Batch</h1>
        <p className="bagian-pengantar">Posisi terbaru tiap batch. Timeline lengkapnya ada di halaman batch.</p>
      </header>

      <StripNegara
        pilihan={pilihan}
        aktif={aktif}
        hrefUntuk={(kode) => (kode === SEMUA ? "/tracking" : `/tracking?negara=${kode}`)}
        label="Filter tracking per negara"
      />

      {tampil.length === 0 ? (
        <div className="kosong kosong-tiket">
          <p className="kosong-judul">Belum ada batch dari {negaraAktif?.nama ?? "negara mana pun"}.</p>
          <p>
            Pengumuman batch baru lewat{" "}
            <a href={KONTAK.x} target="_blank" rel="noreferrer">
              {KONTAK.xHandle}
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="daftar-lacak">
          {tampil.map((b) => {
            const info = katalog.lengkap(b.id)!;
            const update = updateTerakhir(b);
            return (
              <li key={b.id} className="lacak-baris">
                <div className="lacak-identitas">
                  <p className="tiket-negara">
                    <Bendera kode={info.negara.kode} />
                    {info.negara.nama} · {info.komponen.nama}
                  </p>
                  <h2 className="lacak-nama">{b.nama}</h2>
                </div>
                <RelPosisi
                  status={b.status}
                  negara={info.negara.kode}
                  tutup={b.status === "open" && !masihBuka(b, sekarang)}
                />
                <div className="lacak-update">
                  {update ? (
                    <>
                      <time className="mono" dateTime={update.tanggal}>
                        {formatTanggal(update.tanggal)}
                      </time>
                      <p>{update.catatan || "Status diperbarui."}</p>
                    </>
                  ) : (
                    <p>Belum ada update tracking.</p>
                  )}
                </div>
                <Link className="tombol tombol-kedua lacak-tombol" href={`/po/${b.slug}`}>
                  Lihat timeline
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
