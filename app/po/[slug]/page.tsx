import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import StatusBadge from "@/components/StatusBadge";
import Timeline from "@/components/Timeline";
import { KONTAK, MATA_UANG, hargaRupiah, totalSlot } from "@/lib/data";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { batchLengkapBySlug } from "@/lib/db";

export const metadata: Metadata = { title: "Detail Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanBatch({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await batchLengkapBySlug(slug).catch(() => undefined);
  if (!data) notFound();
  const { batch, komponen, negara } = data;
  const slot = totalSlot(batch);

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
          Rp500 terdekat. Ongkir dan fee dihitung admin saat konfirmasi total ke kamu.
        </p>
      </section>

      <section className="bagian" aria-labelledby="judul-tracking">
        <h2 id="judul-tracking">Tracking batch</h2>
        <Timeline tracking={batch.tracking} statusSekarang={batch.status} />
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
          <li>Tunggu konfirmasi total dari admin, lalu bayar sesuai jumlah itu.</li>
        </ol>
        <p className="po-kartu-meta">
          Udah nerima barang dan mau kasih bintang? Ada form review di{" "}
          <Link href="/#judul-review">beranda</Link>.
        </p>
      </section>
    </div>
  );
}
