import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { KONTAK } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { muatKatalog } from "@/lib/db";

export const metadata: Metadata = { title: "PO & Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanPO() {
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

  return (
    <div className="wadah">
      <h1>PO &amp; Batch</h1>
      <p className="bagian-pengantar">
        Dibagi per negara, lalu per komponen, lalu per batch. Buka batchnya buat lihat harga, rincian biaya, dan
        tracking.
      </p>
      {katalog.negaraList.map((n) => {
        const batches = katalog.batchList.filter(
          (b) => katalog.komponenList.find((k) => k.id === b.komponenId)?.negara === n.kode
        );
        return (
          <section key={n.kode} id={`negara-${n.kode}`} className="bagian" aria-labelledby={`judul-${n.kode}`}>
            <h2 id={`judul-${n.kode}`}>
              {n.nama} <span className="chip">{n.mataUang}</span>
            </h2>
            {batches.length === 0 ? (
              <p className="kosong">
                Belum ada batch untuk {n.nama}. Pantau{" "}
                <a href={KONTAK.x} target="_blank" rel="noreferrer">
                  {KONTAK.xHandle}
                </a>{" "}
                buat pengumuman.
              </p>
            ) : (
              <div className="grid grid-po">
                {batches.map((b) => {
                  const komponen = katalog.komponenList.find((k) => k.id === b.komponenId);
                  const slot = {
                    terisi: b.items.reduce((a, i) => a + i.terisi, 0),
                    kuota: b.items.reduce((a, i) => a + i.kuota, 0),
                  };
                  return (
                    <article key={b.id} className="kartu po-kartu">
                      <div className="po-kartu-atas">
                        <span className="badge badge-netral">{komponen?.nama ?? "Umum"}</span>
                        <StatusBadge status={b.status} />
                      </div>
                      <h3 className="po-kartu-nama">{b.nama}</h3>
                      <p className="po-kartu-meta">
                        PO {formatTanggal(b.bukaPo)} sampai {formatTanggal(b.tutupPo)}
                      </p>
                      <p className="po-kartu-meta">
                        {slot.terisi}/{slot.kuota} slot · kurs GO 1 {n.mataUang} = {formatRupiah(b.kursGo)}
                      </p>
                      <div className="po-kartu-aksi">
                        <Link className="tombol tombol-kedua" href={`/po/${b.slug}`}>
                          Lihat detail
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
