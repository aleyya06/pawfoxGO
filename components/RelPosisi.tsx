import { STATUS_TRACKING, labelStatus, urutanStatus, type StatusTracking } from "@/lib/data";

// Rel mini lima stop untuk daftar tracking: sekilas kelihatan batch ada di
// tahap berapa tanpa membuka timeline lengkap. Titiknya dekoratif; teks di
// bawahnya yang membawa informasi untuk pembaca layar.
export default function RelPosisi({ status }: { status: StatusTracking }) {
  const posisi = urutanStatus(status);
  return (
    <div className="rel-posisi">
      <div
        className="rel-titik"
        aria-hidden="true"
        style={{ "--isi": posisi / (STATUS_TRACKING.length - 1) } as React.CSSProperties}
      >
        {STATUS_TRACKING.map((s, i) => (
          <span key={s.id} className={i < posisi ? "lewat" : i === posisi ? "sekarang" : undefined} />
        ))}
      </div>
      <p className="rel-label">
        <span className="mono">
          Tahap {posisi + 1}/{STATUS_TRACKING.length}
        </span>{" "}
        {labelStatus(status)}
      </p>
    </div>
  );
}
