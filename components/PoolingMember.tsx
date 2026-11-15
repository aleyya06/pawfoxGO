import type { SlotMember } from "@/lib/tampilan";

// Pooling photocard per member A2O SOUL. Kalau batch punya item
// "POB Photocard · <Nama>", tiap member tampil dengan sisa slotnya. Kalau
// belum, halaman detail cukup menampilkan daftar member dengan keterangan
// bahwa slot per member diumumkan admin (tanpa angka karangan).
// Versi ringkas (di tiket) hanya muncul kalau slot per member sudah ada.
export default function PoolingMember({
  member,
  daftarNama = [],
  ringkas = false,
}: {
  member: SlotMember[];
  daftarNama?: string[];
  ringkas?: boolean;
}) {
  if (member.length === 0 && (ringkas || daftarNama.length === 0)) return null;

  const daftar = (
    <ul className="pooling-daftar">
      {member.length > 0
        ? member.map((m) => {
            const sisa = Math.max(0, m.kuota - m.terisi);
            return (
              <li key={m.nama} className={sisa === 0 ? "penuh" : undefined}>
                <span className="pooling-nama">{m.nama}</span>
                <span className="pooling-sisa mono">{sisa > 0 ? `sisa ${sisa}` : "penuh"}</span>
              </li>
            );
          })
        : daftarNama.map((nama) => (
            <li key={nama}>
              <span className="pooling-nama">{nama}</span>
            </li>
          ))}
    </ul>
  );

  if (ringkas) {
    return (
      <div className="pooling">
        <p className="pooling-judul">POB Photocard · Pilih Member A2O SOUL</p>
        {daftar}
      </div>
    );
  }

  return (
    <section className="pooling" aria-labelledby="judul-pooling">
      <h2 id="judul-pooling" className="pooling-judul-besar">
        Photocard Member A2O SOUL
      </h2>
      {daftar}
      {member.length === 0 && (
        <p className="pooling-catatan">Slot per member diumumkan admin. Sebut member pilihanmu saat DM order.</p>
      )}
    </section>
  );
}
