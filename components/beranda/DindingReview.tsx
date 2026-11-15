import { formatTanggal } from "@/lib/format";

// Review buyer asli dari database, ditata seperti photocard di toploader.
// Pojok holo meniru foil photocard; tilt kecil hanya saat hover.
export default function DindingReview({
  reviews,
}: {
  reviews: { id: number; nama: string; bintang: number; teks: string; tanggal: string; batchNama: string }[];
}) {
  if (reviews.length === 0) {
    return <p className="kosong">Belum ada review yang tampil. Kalau barangmu sudah sampai, jadilah yang pertama lewat form di samping.</p>;
  }
  return (
    <ul className="dinding-review">
      {reviews.map((r) => (
        <li key={r.id} className="toploader">
          <figure className="toploader-isi">
            <p className="toploader-bintang" aria-label={`Rating ${r.bintang} dari 5`}>
              <span aria-hidden="true">
                {"★".repeat(r.bintang)}
                <span className="bintang-kosong">{"★".repeat(5 - r.bintang)}</span>
              </span>
            </p>
            <blockquote className="toploader-teks">{r.teks}</blockquote>
            <figcaption className="toploader-kaki">
              <span className="toploader-nama">{r.nama}</span>
              <span className="tag-koleksi">{r.batchNama}</span>
              <time className="mono" dateTime={r.tanggal}>
                {formatTanggal(r.tanggal)}
              </time>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
