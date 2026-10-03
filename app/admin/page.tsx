import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LABEL_STATUS_PESANAN, STATUS_TRACKING, nadaStatusPesanan, type StatusPesanan } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { muatKatalog, profilSesi, semuaPesanan, semuaProfil, semuaReview } from "@/lib/db";
import { aksiBuatTagihan, aksiStatusPesanan, aksiTambahTracking, aksiToggleReview } from "./actions";

export const metadata: Metadata = { title: "Panel Admin" };
export const dynamic = "force-dynamic";

const PESAN: Record<string, string> = {
  "sukses=tagihan": "Tagihan baru berhasil dibuat.",
  "sukses=status": "Status pesanan diperbarui.",
  "sukses=tracking": "Update tracking tersimpan.",
  "sukses=review": "Review diperbarui.",
  "galat=tagihan": "Gagal membuat tagihan, coba lagi.",
  "galat=buyer": "Isi buyer LINE atau username + 4 digit WA.",
  "galat=status": "Gagal mengubah status.",
  "galat=tracking": "Gagal menyimpan tracking.",
  "galat=review": "Gagal mengubah review.",
};

export default async function HalamanAdmin({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sesi = await profilSesi();
  if (!sesi) redirect("/masuk");
  if (!sesi.isAdmin) {
    return (
      <div className="wadah">
        <h1>Panel Admin</h1>
        <p className="kosong">Akunmu nggak punya akses admin.</p>
      </div>
    );
  }

  const params = await searchParams;
  const pesanKunci = Object.keys(PESAN).find((k) => params[k.split("=")[0]] === k.split("=")[1]);

  let katalog, pesanan, profilList, reviewList;
  try {
    [katalog, pesanan, profilList, reviewList] = await Promise.all([
      muatKatalog(),
      semuaPesanan(),
      semuaProfil(),
      semuaReview(),
    ]);
  } catch {
    return (
      <div className="wadah">
        <h1>Panel Admin</h1>
        <p className="kosong">
          Database belum tersambung, jadi panel belum bisa menampilkan data. Perbaiki `SUPABASE_URL` di `.env.local`
          lalu muat ulang halaman.
        </p>
      </div>
    );
  }
  const batchNama = new Map(katalog.batchList.map((b) => [b.id, b.nama]));

  return (
    <div className="wadah">
      <h1>Panel Admin</h1>
      <p className="bagian-pengantar">Halo {sesi.nama}, dari sini kamu kelola tagihan, tracking, dan review.</p>
      {pesanKunci && <p className="note">{PESAN[pesanKunci]}</p>}

      <section className="bagian" aria-labelledby="admin-tagihan">
        <h2 id="admin-tagihan">Semua tagihan &amp; pesanan</h2>
        {pesanan.length === 0 ? (
          <p className="kosong">Belum ada pesanan. Bikin tagihan pertama di form bawah.</p>
        ) : (
          <div className="tabel-gulir">
            <table>
              <thead>
                <tr>
                  <th scope="col">Kode</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Batch</th>
                  <th scope="col" className="angka">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ubah status</th>
                </tr>
              </thead>
              <tbody>
                {pesanan.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="chip kode-chip">{p.kode}</span>
                    </td>
                    <td>{p.buyerLabel}</td>
                    <td>{p.batchNama}</td>
                    <td className="angka">{formatRupiah(p.totalRp)}</td>
                    <td>
                      <span className={`badge ${nadaStatusPesanan(p.status)}`}>{LABEL_STATUS_PESANAN[p.status]}</span>
                    </td>
                    <td>
                      <form action={aksiStatusPesanan} className="baris-status">
                        <input type="hidden" name="orderId" value={p.id} />
                        <select name="status" defaultValue={p.status} aria-label={`Ubah status ${p.kode}`}>
                          {(Object.keys(LABEL_STATUS_PESANAN) as StatusPesanan[]).map((s) => (
                            <option key={s} value={s}>
                              {LABEL_STATUS_PESANAN[s]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="tombol tombol-kecil">
                          Simpan
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bagian" aria-labelledby="admin-bikin">
        <h2 id="admin-bikin">Bikin tagihan</h2>
        <form action={aksiBuatTagihan} className="kartu form-admin">
          <label>
            Batch
            <select name="batchId" required defaultValue="">
              <option value="" disabled>
                Pilih batch
              </option>
              {katalog.batchList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </label>
          <label>
            Item
            <select name="itemId" required defaultValue="">
              <option value="" disabled>
                Pilih item
              </option>
              {katalog.batchList.flatMap((b) =>
                b.items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {b.nama} · {i.nama}
                  </option>
                ))
              )}
            </select>
          </label>
          <label>
            Jumlah
            <input type="number" name="qty" min={1} defaultValue={1} required />
          </label>
          <fieldset className="form-admin-fieldset">
            <legend>Buyer (isi salah satu cara)</legend>
            <label>
              Buyer LINE
              <select name="profilId" defaultValue="">
                <option value="">Tanpa akun LINE</option>
                {profilList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Atau username (buyer tanpa LINE)
              <input type="text" name="username" placeholder="contohbuyer" />
            </label>
            <label>
              4 digit terakhir WA-nya
              <input type="text" name="waLast4" inputMode="numeric" maxLength={4} placeholder="1234" />
            </label>
          </fieldset>
          <label>
            Catatan (opsional)
            <input type="text" name="catatan" placeholder="Contoh: bayar DP dulu" />
          </label>
          <button type="submit" className="tombol">
            Bikin tagihan
          </button>
        </form>
      </section>

      <section className="bagian" aria-labelledby="admin-tracking">
        <h2 id="admin-tracking">Update tracking batch</h2>
        <form action={aksiTambahTracking} className="kartu form-admin">
          <label>
            Batch
            <select name="batchId" required defaultValue="">
              <option value="" disabled>
                Pilih batch
              </option>
              {katalog.batchList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status baru
            <select name="status" required defaultValue="po_dibuka">
              {STATUS_TRACKING.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Catatan
            <input type="text" name="catatan" placeholder="Contoh: udah keluar customs" />
          </label>
          <label>
            Tanggal
            <input type="date" name="tanggal" defaultValue={new Date().toISOString().slice(0, 10)} />
          </label>
          <button type="submit" className="tombol">
            Simpan update
          </button>
        </form>
      </section>

      <section className="bagian" aria-labelledby="admin-review">
        <h2 id="admin-review">Review buyer</h2>
        {reviewList.length === 0 ? (
          <p className="kosong">Belum ada review masuk.</p>
        ) : (
          <ul className="daftar-admin">
            {reviewList.map((r) => (
              <li key={r.id} className="kartu review-kartu">
                <p className="bintang" aria-label={`rating ${r.bintang} dari 5`}>
                  {"★".repeat(r.bintang)}
                  <span className="bintang-kosong">{"★".repeat(5 - r.bintang)}</span>
                </p>
                <p className="review-teks">{r.teks}</p>
                <p className="po-kartu-meta">
                  {r.nama} · {batchNama.get(r.batchId) ?? "Batch"} · {formatTanggal(r.tanggal)} ·{" "}
                  {r.tampil ? "tampil" : "disembunyikan"}
                </p>
                <form action={aksiToggleReview}>
                  <input type="hidden" name="reviewId" value={r.id} />
                  <input type="hidden" name="tampil" value={r.tampil ? "1" : "0"} />
                  <button type="submit" className="tombol tombol-kedua tombol-kecil">
                    {r.tampil ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="po-kartu-meta">
        Butuh edit batch, item, atau kurs GO? Bisa lewat <strong>Supabase Table Editor</strong> dulu, panel edit batch
        menyusul.
      </p>
      <p className="po-kartu-meta">
        <Link href="/tagihan">Kembali ke halaman tagihanku</Link>
      </p>
    </div>
  );
}
