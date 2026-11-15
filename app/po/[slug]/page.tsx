import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Bendera from "@/components/Bendera";
import BilahSlot from "@/components/BilahSlot";
import Countdown from "@/components/Countdown";
import Ikon from "@/components/Ikon";
import StempelStatus from "@/components/StempelStatus";
import Timeline from "@/components/Timeline";
import { MATA_UANG, hargaRupiah, totalSlot } from "@/lib/data";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { batchLengkapBySlug } from "@/lib/db";
import { IATA_ASAL, IATA_TUJUAN, batasTutup } from "@/lib/tampilan";

export const metadata: Metadata = { title: "Detail Batch" };
export const dynamic = "force-dynamic";

export default async function HalamanBatch({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await batchLengkapBySlug(slug).catch(() => undefined);
  if (!data) notFound();
  const { batch, komponen, negara } = data;
  const slot = totalSlot(batch);
  const sisa = Math.max(0, slot.kuota - slot.terisi);
  const lewat = batch.status === "open" && Date.now() > batasTutup(batch.tutupPo);
  const masihBuka = batch.status === "open" && !lewat;
  const iata = IATA_ASAL[negara.kode];

  return (
    <div className="wadah halaman halaman-batch">
      <p className="remah">
        <Link href="/po">Semua PO &amp; batch</Link>
      </p>

      <article className="pass" aria-labelledby="judul-batch">
        <div className="pass-badan">
          <div className="tiket-atas">
            <span className="tiket-negara">
              <Bendera kode={negara.kode} />
              <span className="mono">{negara.kode}</span>
              <span>{negara.nama}</span>
            </span>
            <span className="tag-koleksi">{komponen.nama}</span>
          </div>
          <h1 id="judul-batch" className="pass-nama">
            {batch.nama}
          </h1>
          <p className="tiket-rute pass-rute mono">
            {iata ? (
              <>
                {iata}
                <Ikon nama="pesawat" className="tiket-rute-pesawat" />
                {IATA_TUJUAN}
              </>
            ) : (
              "Rute lokal"
            )}
          </p>
          <dl className="pass-data">
            <div>
              <dt>Buka PO</dt>
              <dd className="mono">{formatTanggal(batch.bukaPo)}</dd>
            </div>
            <div>
              <dt>Tutup PO</dt>
              <dd className={`mono${lewat ? " lewat" : ""}`}>
                {formatTanggal(batch.tutupPo)}
                {lewat && " · lewat"}
              </dd>
            </div>
            <div>
              <dt>Rate GO</dt>
              <dd className="mono">
                {negara.mataUang === "IDR" ? "Harga langsung rupiah" : `1 ${negara.mataUang} = ${formatRupiah(batch.kursGo)}`}
              </dd>
            </div>
          </dl>
          {masihBuka && <Countdown tutupPo={batch.tutupPo} />}
          <StempelStatus status={batch.status} className="tiket-stempel" />
        </div>

        <div className="tiket-sobek" aria-hidden="true" />

        <div className="pass-stub">
          <BilahSlot terisi={slot.terisi} kuota={slot.kuota} gerak={false} />
          {masihBuka && (
            <p className={`sisa-slot${slot.kuota > 0 && sisa / slot.kuota <= 0.25 ? " mendesak" : ""}`}>
              {sisa > 0 ? `Sisa ${sisa} slot` : "Slot penuh"}
            </p>
          )}
          <p className="pass-catatan">
            Rate GO fix selama batch jalan, beda dengan rate live di <Link href="/kalkulator">Kalkulator</Link>.
          </p>
        </div>
      </article>

      {batch.catatan && <p className="note">{batch.catatan}</p>}

      <section className="bagian" aria-labelledby="judul-item">
        <h2 id="judul-item">Item &amp; harga</h2>
        <div className="tabel-gulir manifest">
          <table>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col" className="angka">
                  Harga lokal
                </th>
                <th scope="col" className="angka">
                  Harga rupiah
                </th>
                <th scope="col" className="angka">
                  Slot
                </th>
              </tr>
            </thead>
            <tbody>
              {batch.items.length === 0 ? (
                <tr>
                  <td colSpan={4}>Item batch ini belum diisi admin.</td>
                </tr>
              ) : (
                batch.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td className="angka mono" data-label="Harga lokal">
                      {MATA_UANG[negara.mataUang].simbol} {formatAngka(item.hargaLokal)}
                    </td>
                    <td className="angka mono" data-label="Harga rupiah">
                      {formatRupiah(hargaRupiah(item.hargaLokal, batch.kursGo))}
                    </td>
                    <td className="angka mono" data-label="Slot">
                      {item.terisi}/{item.kuota}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="catatan-kecil">
          Total slot <span className="mono">{slot.terisi}/{slot.kuota}</span>. Harga rupiah = harga lokal dikali rate
          GO, dibulatkan ke atas ke Rp500 terdekat. Ongkir dan fee dihitung admin saat konfirmasi total ke kamu.
        </p>
      </section>

      <section className="bagian" aria-labelledby="judul-tracking">
        <h2 id="judul-tracking">Tracking batch</h2>
        <Timeline tracking={batch.tracking} statusSekarang={batch.status} />
      </section>

      <p className="catatan-kecil">
        Udah nerima barang dan mau kasih bintang? Ada form review di <Link href="/#judul-review">beranda</Link>.
      </p>
    </div>
  );
}
