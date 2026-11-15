import type { Metadata } from "next";
import StripNegara, { SEMUA } from "@/components/StripNegara";
import TiketBatch from "@/components/TiketBatch";
import { KONTAK } from "@/lib/data";
import { muatKatalog } from "@/lib/db";
import { keTiket, masihBuka, negaraBatch } from "@/lib/tampilan";

export const metadata: Metadata = { title: "PO & Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanPO({ searchParams }: { searchParams: Promise<{ negara?: string }> }) {
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

  // Batch yang masih buka di depan (tutup paling dekat dulu), sisanya urut
  // tanggal tutup terbaru.
  const semua = [...katalog.batchList].sort((a, b) => {
    const bukaA = masihBuka(a, sekarang);
    const bukaB = masihBuka(b, sekarang);
    if (bukaA !== bukaB) return bukaA ? -1 : 1;
    return bukaA ? a.tutupPo.localeCompare(b.tutupPo) : b.tutupPo.localeCompare(a.tutupPo);
  });
  const tampil = negaraAktif ? semua.filter((b) => negaraBatch(katalog, b) === negaraAktif.kode) : semua;

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
        <h1>PO &amp; Batch</h1>
        <p className="bagian-pengantar">Semua batch per negara. Yang masih buka ada di paling depan.</p>
      </header>

      <StripNegara
        pilihan={pilihan}
        aktif={aktif}
        hrefUntuk={(kode) => (kode === SEMUA ? "/po" : `/po?negara=${kode}`)}
        label="Filter batch per negara"
      />

      {tampil.length === 0 ? (
        <div className="kosong kosong-tiket">
          <p className="kosong-judul">Belum ada batch untuk {negaraAktif?.nama ?? "saat ini"}.</p>
          <p>
            Pengumuman batch baru selalu lewat{" "}
            <a href={KONTAK.x} target="_blank" rel="noreferrer">
              {KONTAK.xHandle}
            </a>
            .
          </p>
        </div>
      ) : (
        <div className={`tumpukan-tiket${tampil.length >= 3 ? " dua-kolom" : ""}`}>
          {tampil.map((b) => (
            <TiketBatch key={b.id} t={keTiket(katalog, b, sekarang)} judulTag="h2" />
          ))}
        </div>
      )}
    </div>
  );
}
