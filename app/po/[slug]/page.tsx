import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import StatusBadge from "@/components/StatusBadge";
import Timeline from "@/components/Timeline";
import { KONTAK, MATA_UANG, biayaPerSlot, hargaRupiah, totalSlot } from "@/lib/data";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { batchLengkapBySlug, reviewTampil } from "@/lib/db";

export const metadata: Metadata = { title: "Detail Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanBatch({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await batchLengkapBySlug(slug).catch(() => undefined);
  if (!data) notFound();
  const { batch, komponen, negara } = data;
  const slot = totalSlot(batch);
  const tambahan = biayaPerSlot(batch);
  const reviews = await reviewTampil(batch.id).catch(() => []);

  return (
    <div className="wadah">
      <p>
        <Link href="/po">Semua PO &amp; batch</Link>
      </p>
      <div className="detail-atas">
        <span className="chip">{negara.nama}</span>
        <span className="badge badge-netral">{komponen.nama}</span>
        <StatusBadge status={batch.status} />
      </div>
      <h1>{batch.nama}</h1>
      <p className="bagian-pengantar">
        PO {formatTanggal(batch.bukaPo)} sampai {formatTanggal(batch.tutupPo)}.
      </p>
      <Countdown tutupPo={batch.tutupPo} />
      {batch.catatan && <p className="note">{batch.catatan}</p>}

      <div className="info-kurs">
        Kurs GO batch ini: 1 {negara.mataUang} = {formatRupiah(batch.kursGo)}
        <small>Kurs GO fix selama batch jalan, beda dengan kurs live di kalkulator.</small>
      </div>

      <section className="bagian" aria-labelledby="judul-item">
        <h2 id="judul-item">Item &amp; harga</h2>
        <div className="tabel-gulir">
          <table>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col" className="angka">Harga lokal</th>
                <th scope="col" className="angka">Harga rupiah</th>
                <th scope="col" className="angka">Slot</th>
              </tr>
            </thead>
            <tbody>
              {batch.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td className="angka">
                    {MATA_UANG[negara.mataUang].simbol} {formatAngka(item.hargaLokal)}
                  </td>
                  <td className="angka">{formatRupiah(hargaRupiah(item.hargaLokal, batch.kursGo))}</td>
                  <td className="angka">
                    {item.terisi}/{item.kuota}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="po-kartu-meta">
          Total slot {slot.terisi}/{slot.kuota}. Harga rupiah = harga lokal dikali kurs GO, dibulatkan ke atas ke
          Rp500 terdekat.
        </p>
      </section>

      <section className="bagian" aria-labelledby="judul-biaya">
        <h2 id="judul-biaya">Rincian biaya per slot</h2>
        <div className="tabel-gulir">
          <table>
            <tbody>
              <tr>
                <td>Ongkir lokal (di negara asal)</td>
                <td className="angka">{formatRupiah(batch.ongkirLokal)}</td>
              </tr>
              <tr>
                <td>Ongkir internasional</td>
                <td className="angka">{formatRupiah(batch.ongkirInternasional)}</td>
              </tr>
              <tr>
                <td>Fee organizer</td>
                <td className="angka">{formatRupiah(batch.feeOrganizer)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total tambahan per slot</strong>
                </td>
                <td className="angka">
                  <strong>{formatRupiah(tambahan)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="po-kartu-meta">Total bayar per item = harga rupiah item + tambahan per slot.</p>
      </section>

      <section className="bagian" aria-labelledby="judul-tracking">
        <h2 id="judul-tracking">Tracking batch</h2>
        <Timeline tracking={batch.tracking} statusSekarang={batch.status} />
      </section>

      <section className="bagian" aria-labelledby="judul-review">
        <h2 id="judul-review">Kata buyer</h2>
        {reviews.length === 0 ? (
          <p className="kosong">Belum ada review untuk batch ini.</p>
        ) : (
          <div className="grid grid-po">
            {reviews.map((r) => (
              <article key={r.id} className="kartu review-kartu">
                <p className="bintang" aria-label={`rating ${r.bintang} dari 5`}>
                  {"★".repeat(r.bintang)}
                  <span className="bintang-kosong">{"★".repeat(5 - r.bintang)}</span>
                </p>
                <p className="review-teks">{r.teks}</p>
                <p className="po-kartu-meta">
                  {r.nama} · {formatTanggal(r.tanggal)}
                </p>
              </article>
            ))}
          </div>
        )}
        <p className="po-kartu-meta">
          Udah terima barangmu? DM{" "}
          <a href={KONTAK.x} target="_blank" rel="noreferrer">
            {KONTAK.xHandle}
          </a>{" "}
          dengan format: kode order, bintang (1 sampai 5), dan ceritamu. Review asli buyer akan ditampilkan di sini.
        </p>
      </section>

      <section className="bagian" aria-labelledby="judul-ikut">
        <h2 id="judul-ikut">Mau ikut PO ini?</h2>
        <ol className="cara-ikut">
          <li>Pilih item dan jumlahnya.</li>
          <li>
            Kirim DM ke{" "}
            <a href={KONTAK.x} target="_blank" rel="noreferrer">
              {KONTAK.xHandle}
            </a>{" "}
            di X dengan format: nama batch, nama item, jumlah.
          </li>
          <li>Tunggu konfirmasi slot, lalu bayar sesuai total di atas.</li>
        </ol>
      </section>
    </div>
  );
}
