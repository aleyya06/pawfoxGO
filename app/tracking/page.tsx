import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { KONTAK } from "@/lib/data";
import { formatTanggal } from "@/lib/format";
import { muatKatalog } from "@/lib/db";

export const metadata: Metadata = { title: "Tracking Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanTracking() {
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

  const terakhir = (batchId: string) => {
    const batch = katalog.batchList.find((b) => b.id === batchId);
    return batch && batch.tracking.length > 0 ? batch.tracking[batch.tracking.length - 1] : undefined;
  };
  const urut = [...katalog.batchList].sort((a, b) =>
    (terakhir(b.id)?.tanggal ?? "").localeCompare(terakhir(a.id)?.tanggal ?? "")
  );

  return (
    <div className="wadah">
      <h1>Tracking Batch</h1>
      <p className="bagian-pengantar">Posisi terbaru tiap batch. Timeline lengkapnya ada di halaman batch masing-masing.</p>
      {urut.length === 0 ? (
        <div className="kosong">
          <p>Belum ada batch yang jalan.</p>
          <p>
            Pengumuman batch baru lewat X:{" "}
            <a href={KONTAK.x} target="_blank" rel="noreferrer">
              {KONTAK.xHandle}
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-po">
          {urut.map((b) => {
            const info = katalog.lengkap(b.id)!;
            const update = terakhir(b.id);
            return (
              <article key={b.id} className="kartu po-kartu">
                <div className="po-kartu-atas">
                  <span className="chip">{info.negara.nama}</span>
                  <StatusBadge status={b.status} />
                </div>
                <h3 className="po-kartu-nama">{b.nama}</h3>
                <p className="po-kartu-meta">{info.komponen.nama}</p>
                {update ? (
                  <p className="po-kartu-meta">
                    Update terakhir {formatTanggal(update.tanggal)}: {update.catatan}
                  </p>
                ) : (
                  <p className="po-kartu-meta">Belum ada update tracking.</p>
                )}
                <div className="po-kartu-aksi">
                  <Link className="tombol tombol-kedua" href={`/po/${b.slug}`}>
                    Lihat timeline
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
