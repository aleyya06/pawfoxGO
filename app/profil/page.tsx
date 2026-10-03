import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import KartuPesanan from "@/components/KartuPesanan";
import { KONTAK } from "@/lib/data";
import { pesananProfil, profilSesi } from "@/lib/db";
import type { Pesanan } from "@/lib/data";

export const metadata: Metadata = { title: "Profil" };
export const dynamic = "force-dynamic";

function BarisProfil({
  href,
  judul,
  sub,
  jumlah,
  eksternal = false,
}: {
  href: string;
  judul: string;
  sub: string;
  jumlah?: number;
  eksternal?: boolean;
}) {
  return (
    <a
      className="baris-profil"
      href={href}
      {...(eksternal ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span>
        <span className="baris-profil-judul">{judul}</span>
        <span className="baris-profil-sub">{sub}</span>
      </span>
      {typeof jumlah === "number" && jumlah > 0 && <span className="badge badge-orange">{jumlah}</span>}
      <span className="chevron" aria-hidden="true">
        ›
      </span>
    </a>
  );
}

export default async function HalamanProfil() {
  const sesi = await profilSesi().catch(() => null);
  if (!sesi) redirect("/masuk");

  let daftar: Pesanan[];
  try {
    daftar = await pesananProfil(sesi.id);
  } catch {
    return (
      <div className="wadah">
        <h1>Profil</h1>
        <p className="kosong">
          Database belum tersambung, jadi pesanan belum bisa ditampilkan. Coba lagi sebentar, kalau masih gagal
          hubungi admin.
        </p>
      </div>
    );
  }

  const belum = daftar.filter((p) => p.status === "menunggu_bayar");
  const verifikasi = daftar.filter((p) => p.status === "menunggu_verifikasi");
  const riwayat = daftar.filter((p) => p.status === "lunas" || p.status === "dibatalkan" || p.status === "refund");

  // Dikelompokkan per batch supaya kelihatan jelas orderan ada di batch berapa.
  const perBatch = new Map<string, Pesanan[]>();
  for (const p of daftar) {
    const kunci = `${p.batchNama}|${p.batchSlug}`;
    perBatch.set(kunci, [...(perBatch.get(kunci) ?? []), p]);
  }

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
          <h1 className="profil-nama">{sesi.nama}</h1>
          <span className="badge badge-orange">Member</span>
        </div>
      </div>

      <section className="bagian" aria-labelledby="judul-ringkas">
        <h2 id="judul-ringkas" className="judul-seksi">
          Pesanan kamu
        </h2>
        <div className="daftar-profil">
          <BarisProfil
            href="#belum"
            judul="Belum dibayar"
            sub={belum.length === 0 ? "Semua tagihan sudah lunas" : `${belum.length} tagihan nunggu dibayar`}
            jumlah={belum.length}
          />
          <BarisProfil
            href="#verifikasi"
            judul="Menunggu verifikasi"
            sub={verifikasi.length === 0 ? "Tidak ada pembayaran yang dicek" : `${verifikasi.length} pembayaran dicek admin`}
            jumlah={verifikasi.length}
          />
          <BarisProfil
            href="#riwayat"
            judul="Riwayat"
            sub={riwayat.length === 0 ? "Belum ada pesanan selesai" : `${riwayat.length} pesanan selesai`}
            jumlah={riwayat.length}
          />
          <BarisProfil href="/tracking" judul="Pengiriman" sub="Lihat posisi semua batch" />
          <BarisProfil
            href={KONTAK.x}
            judul="Refund"
            sub="Ajukan lewat DM admin"
            eksternal
          />
        </div>
      </section>

      <section className="bagian" aria-labelledby="judul-batch">
        <h2 id="judul-batch" className="judul-seksi">
          Orderan di batch kamu
        </h2>
        {daftar.length === 0 ? (
          <p className="kosong">
            Belum ada pesanan. Lihat <Link href="/po">PO yang lagi buka</Link> dan DM admin buat ikut.
          </p>
        ) : (
          <div className="daftar-batch">
            {[...perBatch.entries()].map(([kunci, list]) => {
              const [nama, slug] = kunci.split("|");
              return (
                <article key={kunci} className="kartu grup-batch">
                  <div className="grup-batch-atas">
                    <h3 className="po-kartu-nama">{nama}</h3>
                    {slug && (
                      <Link className="po-kartu-meta" href={`/po/${slug}`}>
                        Lihat tracking
                      </Link>
                    )}
                  </div>
                  <ul className="daftar-item">
                    {list.map((p) => (
                      <li key={p.id}>
                        <span className="chip kode-chip">{p.kode}</span> {p.items.map((i) => `${i.nama} x${i.qty}`).join(", ")} ·{" "}
                        <strong>{p.status === "menunggu_bayar" ? "belum dibayar" : p.status === "menunggu_verifikasi" ? "dicek admin" : p.status === "lunas" ? "lunas" : p.status}</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="bagian" aria-labelledby="judul-belum">
        <h2 id="judul-belum" className="judul-seksi">
          Detail tagihan belum dibayar
        </h2>
        {belum.length === 0 ? (
          <p className="kosong">Tidak ada yang perlu dibayar.</p>
        ) : (
          <>
            <div className="hasil-buyer">
              {belum.map((p) => (
                <KartuPesanan key={p.id} pesanan={p} lengkap />
              ))}
            </div>
            <p className="po-kartu-meta">
              Cara bayar: bayar lewat QRIS yang dikirim admin lewat DM{" "}
              <a href={KONTAK.x} target="_blank" rel="noreferrer">
                {KONTAK.xHandle}
              </a>
              , terus statusnya pindah ke menunggu verifikasi.
            </p>
          </>
        )}
      </section>

      <section className="bagian" aria-labelledby="judul-verif-detail">
        <h2 id="judul-verif-detail" className="judul-seksi">
          Pembayaran yang dicek admin
        </h2>
        {verifikasi.length === 0 ? (
          <p className="kosong">Tidak ada yang menunggu verifikasi.</p>
        ) : (
          <div className="hasil-buyer">
            {verifikasi.map((p) => (
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
