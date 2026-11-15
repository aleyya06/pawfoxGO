import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { IATA_TUJUAN, type TiketData } from "@/lib/tampilan";
import BilahSlot from "./BilahSlot";
import Bendera from "./Bendera";
import Ikon from "./Ikon";
import StempelStatus from "./StempelStatus";

// Kartu batch berbentuk boarding pass: badan kiri untuk identitas batch,
// garis sobek, lalu stub kanan untuk hal yang dipakai buat memutuskan ikut
// (slot, rate GO, tombol). Bentuk tiket adalah motif identitas PawFox GO.
export default function TiketBatch({ t, judulTag = "h3" }: { t: TiketData; judulTag?: "h2" | "h3" }) {
  const Judul = judulTag;
  const sisa = Math.max(0, t.kuota - t.terisi);
  const masihBuka = t.status === "open" && !t.lewat;
  const mendesak = t.kuota > 0 && sisa / t.kuota <= 0.25;

  return (
    <article className="tiket" aria-labelledby={`tiket-${t.id}`}>
      <div className="tiket-badan">
        <div className="tiket-atas">
          <span className="tiket-negara">
            <Bendera kode={t.negaraKode} />
            <span className="mono">{t.negaraKode}</span>
            <span>{t.negaraNama}</span>
          </span>
          <span className="tag-koleksi">{t.komponen}</span>
        </div>
        <Judul id={`tiket-${t.id}`} className="tiket-nama">
          {t.nama}
        </Judul>
        <p className="tiket-rute mono">
          {t.iata ? (
            <>
              {t.iata}
              <Ikon nama="pesawat" className="tiket-rute-pesawat" />
              {IATA_TUJUAN}
            </>
          ) : (
            "Rute lokal"
          )}
        </p>
        <p className={`tiket-tutup mono${t.lewat ? " lewat" : ""}`}>
          Tutup: {t.tutupLabel}
          {t.lewat && <span> · lewat</span>}
          {masihBuka && t.sisaHari !== null && <span> · {t.sisaHari} hari lagi</span>}
        </p>
        <StempelStatus status={t.status} className="tiket-stempel" />
      </div>

      <div className="tiket-sobek" aria-hidden="true" />

      <div className="tiket-stub">
        <BilahSlot terisi={t.terisi} kuota={t.kuota} />
        {masihBuka && (
          <p className={`sisa-slot${mendesak ? " mendesak" : ""}`}>
            {sisa > 0 ? `Sisa ${sisa} slot` : "Slot penuh"}
          </p>
        )}
        <p className="pil-rate mono">
          {t.mataUang === "IDR" ? "Rupiah langsung" : `1 ${t.mataUang} = ${formatRupiah(t.kursGo)}`}
        </p>
        <Link className="tombol tombol-penuh" href={`/po/${t.slug}`}>
          Lihat batch
        </Link>
      </div>
    </article>
  );
}
