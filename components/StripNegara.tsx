import Link from "next/link";
import Bendera from "./Bendera";

export interface PilihanNegara {
  kode: string;
  nama: string;
  jumlah: number;
}

export const SEMUA = "SEMUA";

// Satu strip filter negara untuk beranda (filter di tempat, lewat onPilih)
// dan untuk /po serta /tracking (filter lewat URL ?negara=, bisa dibagikan).
export default function StripNegara({
  pilihan,
  aktif,
  onPilih,
  hrefUntuk,
  label,
}: {
  pilihan: PilihanNegara[];
  aktif: string;
  onPilih?: (kode: string) => void;
  hrefUntuk?: (kode: string) => string;
  label: string;
}) {
  return (
    <div className="strip-negara" role="group" aria-label={label}>
      {pilihan.map((p) => {
        const isi = (
          <>
            {p.kode !== SEMUA && <Bendera kode={p.kode} />}
            <span className={p.kode === SEMUA ? undefined : "mono"}>{p.kode === SEMUA ? "Semua" : p.kode}</span>
            <span className="strip-jumlah mono" aria-hidden="true">
              {p.jumlah}
            </span>
            <span className="sr-only">
              {p.kode === SEMUA ? `, ${p.jumlah} batch` : ` ${p.nama}, ${p.jumlah} batch`}
            </span>
          </>
        );
        const terpilih = aktif === p.kode;
        if (hrefUntuk) {
          return (
            <Link
              key={p.kode}
              href={hrefUntuk(p.kode)}
              scroll={false}
              className="strip-pilihan"
              aria-current={terpilih ? "page" : undefined}
              data-aktif={terpilih || undefined}
            >
              {isi}
            </Link>
          );
        }
        return (
          <button
            key={p.kode}
            type="button"
            className="strip-pilihan"
            aria-pressed={terpilih}
            data-aktif={terpilih || undefined}
            onClick={() => onPilih?.(p.kode)}
          >
            {isi}
          </button>
        );
      })}
    </div>
  );
}
