import type { SlotMember } from "@/lib/tampilan";

// Pooling photocard per member A2O SOUL: buyer langsung lihat member mana
// yang slotnya masih ada. Tidak tampil sama sekali kalau batch tidak punya
// item "POB Photocard · <Nama>".
export default function PoolingMember({ member }: { member: SlotMember[] }) {
  if (member.length === 0) return null;
  return (
    <div className="pooling">
      <p className="pooling-judul">POB Photocard · Pilih Member A2O SOUL</p>
      <ul className="pooling-daftar">
        {member.map((m) => {
          const sisa = Math.max(0, m.kuota - m.terisi);
          return (
            <li key={m.nama} className={sisa === 0 ? "penuh" : undefined}>
              <span className="pooling-nama">{m.nama}</span>
              <span className="pooling-sisa mono">{sisa > 0 ? `sisa ${sisa}` : "penuh"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
