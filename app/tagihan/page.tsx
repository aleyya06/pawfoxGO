import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import KartuPesanan from "@/components/KartuPesanan";
import { KONTAK, LABEL_STATUS_PESANAN, nadaStatusPesanan } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { pesananProfil, profilSesi } from "@/lib/db";
import type { Pesanan } from "@/lib/data";

export const metadata: Metadata = { title: "Tagihan" };
export const dynamic = "force-dynamic";

function BarisRingkas({ pesanan }: { pesanan: Pesanan }) {
  return (
    <div className="baris-riwayat">
      <span className="chip kode-chip">{pesanan.kode}</span>
      <span className="riwayat-nama">{pesanan.batchNama}</span>
      <span className="riwayat-total">{formatRupiah(pesanan.totalRp)}</span>
      <span className={`badge ${nadaStatusPesanan(pesanan.status)}`}>{LABEL_STATUS_PESANAN[pesanan.status]}</span>
      <span className="po-kartu-meta">{formatTanggal(pesanan.dibuat)}</span>
    </div>
  );
}

export default async function HalamanTagihan() {
  const sesi = await profilSesi().catch(() => null);
  if (!sesi) redirect("/masuk");

  let daftar: Pesanan[];
  try {
    daftar = await pesananProfil(sesi.id);
  } catch {
    return (
      <div className="wadah">
        <h1>Tagihan</h1>
        <p className="kosong">
          Database belum tersambung, jadi tagihan belum bisa ditampilkan. Coba lagi sebentar, kalau masih gagal
          hubungi admin.
        </p>
      </div>
    );
  }

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

      <section className="bagian" aria-labelledby="judul-belum">
        <h2 id="judul-belum">Belum dibayar</h2>
        {belum.length === 0 ? (
          <p className="kosong">Tidak ada yang perlu dibayar. Semua tagihan sudah lunas.</p>
        ) : (
          <>
            <div className="hasil-buyer">
              {belum.map((p) => (
                <KartuPesanan key={p.id} pesanan={p} lengkap />
              ))}
            </div>
            <p className="po-kartu-meta">
              Cara bayar: ambil nominal dari tagihan di atas, bayar lewat QRIS yang dikirim admin lewat DM{" "}
              <a href={KONTAK.x} target="_blank" rel="noreferrer">
                {KONTAK.xHandle}
              </a>
              , terus statusnya pindah ke menunggu verifikasi.
            </p>
          </>
        )}
      </section>

      <section className="bagian" aria-labelledby="judul-verifikasi">
        <h2 id="judul-verifikasi">Menunggu verifikasi</h2>
        {verifikasi.length === 0 ? (
          <p className="kosong">Belum ada pembayaran yang menunggu dicek.</p>
        ) : (
          <div className="daftar-riwayat">
            {verifikasi.map((p) => (
              <BarisRingkas key={p.id} pesanan={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bagian" aria-labelledby="judul-riwayat">
        <h2 id="judul-riwayat">Riwayat</h2>
        {riwayat.length === 0 ? (
          <p className="kosong">Belum ada pesanan selesai.</p>
        ) : (
          <div className="daftar-riwayat">
            {riwayat.map((p) => (
              <BarisRingkas key={p.id} pesanan={p} />
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
