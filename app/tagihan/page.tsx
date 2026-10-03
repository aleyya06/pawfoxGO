import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import KartuPesanan from "@/components/KartuPesanan";
import { pesananProfil, profilSesi } from "@/lib/db";

export const metadata: Metadata = { title: "Tagihan" };
export const dynamic = "force-dynamic";

export default async function HalamanTagihan() {
  const sesi = await profilSesi();
  if (!sesi) redirect("/masuk");

  const daftar = await pesananProfil(sesi.id);
  const belum = daftar.filter((p) => p.status === "menunggu_bayar");
  const verifikasi = daftar.filter((p) => p.status === "menunggu_verifikasi");
  const riwayat = daftar.filter((p) => p.status === "lunas" || p.status === "dibatalkan" || p.status === "refund");

  return (
    <div className="wadah">
      <div className="profil-atas">
        {sesi.avatarUrl ? (
          <img src={sesi.avatarUrl} alt={`Foto profil ${sesi.nama}`} className="profil-avatar" />
        ) : (
          <span className="profil-avatar profil-avatar-kosong" aria-hidden="true">
            {sesi.nama.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div>
          <p className="po-kartu-meta">Masuk sebagai</p>
          <h1 className="profil-nama">{sesi.nama}</h1>
        </div>
      </div>
      <p className="bagian-pengantar">Semua tagihan dan pesanan yang nempel ke akun LINE-mu.</p>

      <section className="bagian" aria-labelledby="judul-belum">
        <h2 id="judul-belum">Belum dibayar</h2>
        {belum.length === 0 ? (
          <p className="kosong">Tidak ada yang perlu dibayar. Semua tagihan sudah lunas.</p>
        ) : (
          <div className="hasil-buyer">
            {belum.map((p) => (
              <KartuPesanan key={p.id} pesanan={p} lengkap />
            ))}
          </div>
        )}
      </section>

      <section className="bagian" aria-labelledby="judul-verifikasi">
        <h2 id="judul-verifikasi">Menunggu verifikasi</h2>
        {verifikasi.length === 0 ? (
          <p className="kosong">Belum ada pembayaran yang menunggu dicek.</p>
        ) : (
          <div className="hasil-buyer">
            {verifikasi.map((p) => (
              <KartuPesanan key={p.id} pesanan={p} lengkap />
            ))}
          </div>
        )}
      </section>

      <section className="bagian" aria-labelledby="judul-riwayat">
        <h2 id="judul-riwayat">Riwayat</h2>
        {riwayat.length === 0 ? (
          <p className="kosong">Belum ada pesanan selesai.</p>
        ) : (
          <div className="hasil-buyer">
            {riwayat.map((p) => (
              <KartuPesanan key={p.id} pesanan={p} lengkap />
            ))}
          </div>
        )}
      </section>

      {sesi.isAdmin && (
        <p className="note">
          Kamu masuk sebagai admin: buka <Link href="/admin">panel admin</Link> buat kelola tagihan dan tracking.
        </p>
      )}
    </div>
  );
}
