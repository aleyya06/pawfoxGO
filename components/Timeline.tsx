import { STATUS_TRACKING, labelStatus, urutanStatus, type UpdateTracking } from "@/lib/data";
import { formatTanggal } from "@/lib/format";
import PawIkon from "./PawIkon";

export default function Timeline({ tracking, statusSekarang }: { tracking: UpdateTracking[]; statusSekarang: string }) {
  const posisi = urutanStatus(statusSekarang as never);

  return (
    <ol className="timeline">
      {STATUS_TRACKING.map(({ id, label }) => {
        const tercapai = urutanStatus(id) <= posisi;
        const updates = tracking.filter((t) => t.status === id);
        return (
          <li key={id} className={`timeline-item${tercapai ? " tercapai" : ""}${id === statusSekarang ? " sekarang" : ""}`}>
            <span className="timeline-bullet" aria-hidden="true">
              <PawIkon className="timeline-paw" />
            </span>
            <div>
              <p className="timeline-label">
                {label}
                {id === statusSekarang && <span className="badge badge-orange timeline-badge">Posisi sekarang</span>}
              </p>
              {updates.map((u, i) => (
                <p key={i} className="timeline-update">
                  <time dateTime={u.tanggal}>{formatTanggal(u.tanggal)}</time>
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
