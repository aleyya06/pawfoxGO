import { STATUS_TRACKING, labelStatusBatch, urutanStatus, type StatusTracking, type UpdateTracking } from "@/lib/data";
import { formatTanggal } from "@/lib/format";
import PawIkon from "./PawIkon";

// Timeline lengkap di halaman batch: lima stop sebaris di desktop dengan
// catatan di bawah tiap stop, stepper tegak di mobile. Bullet paw terisi
// berarti status sudah terlewati. Tahap warehouse menyebut negara batch.
export default function Timeline({
  tracking,
  statusSekarang,
  negara,
  tutup = false,
}: {
  tracking: UpdateTracking[];
  statusSekarang: StatusTracking;
  negara: string;
  tutup?: boolean;
}) {
  const posisi = urutanStatus(statusSekarang);

  return (
    <ol className="timeline">
      {STATUS_TRACKING.map(({ id }, i) => {
        const tercapai = i <= posisi;
        const sekarang = id === statusSekarang;
        const updates = tracking.filter((t) => t.status === id);
        return (
          <li
            key={id}
            className={`timeline-item${tercapai ? " tercapai" : ""}${sekarang ? " sekarang" : ""}`}
            aria-current={sekarang ? "step" : undefined}
          >
            <span className="timeline-bullet" aria-hidden="true">
              <PawIkon className="timeline-paw" />
            </span>
            <div className="timeline-isi">
              <p className="timeline-label">
                {labelStatusBatch(id, negara)}
                {sekarang && (
                  <span className="timeline-sekarang mono">
                    {id === "open" && tutup ? "PO sudah ditutup" : "Posisi sekarang"}
                  </span>
                )}
                {!tercapai && <span className="sr-only"> (belum)</span>}
              </p>
              {updates.map((u, j) => (
                <p key={j} className="timeline-update">
                  <time className="mono" dateTime={u.tanggal}>
                    {formatTanggal(u.tanggal)}
                  </time>
                  <span>{u.catatan}</span>
                </p>
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
