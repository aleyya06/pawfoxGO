import Link from "next/link";
import { LABEL_STATUS_PESANAN, nadaStatusPesanan, type Pesanan } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";

export default function KartuPesanan({ pesanan, lengkap }: { pesanan: Pesanan; lengkap: boolean }) {
  return (
    <article className="kartu hasil-kartu">
      <div className="po-kartu-atas">
        <span className="chip kode-chip">{pesanan.kode}</span>
        <span className={`badge ${nadaStatusPesanan(pesanan.status)}`}>{LABEL_STATUS_PESANAN[pesanan.status]}</span>
      </div>
      <h3 className="po-kartu-nama">{pesanan.batchNama}</h3>
      <p className="po-kartu-meta">Dibuat {formatTanggal(pesanan.dibuat)}</p>
      {lengkap ? (
        <>
          <ul className="daftar-item">
            {pesanan.items.map((t, i) => (
              <li key={i}>
                {t.nama} x{t.qty} ({formatRupiah(t.hargaSatuanRp)})
              </li>
            ))}
          </ul>
          <p className="hasil-total">Total: {formatRupiah(pesanan.totalRp)}</p>
        </>
      ) : (
        <p className="po-kartu-meta">{pesanan.items.length} item dipesan. Buka detail buat lihat rincian dan total.</p>
      )}
      {pesanan.batchSlug && (
        <p className="po-kartu-meta">
          Posisi barang: lihat <Link href={`/po/${pesanan.batchSlug}`}>tracking batch</Link>.
        </p>
      )}
    </article>
  );
}
