import Link from "next/link";
import Countdown from "@/components/Countdown";
import KalkulatorKurs from "@/components/KalkulatorKurs";
import PawIkon from "@/components/PawIkon";
import StatusBadge from "@/components/StatusBadge";
import { KONTAK } from "@/lib/data";
import { formatRupiah } from "@/lib/format";
import { muatKatalog } from "@/lib/db";

export const dynamic = "force-dynamic";

function GalatDb() {
  return (
    <div className="wadah">
      <p className="kosong">
        Database belum tersambung, jadi katalog belum bisa ditampilkan. Cek isi `.env.local` (khususnya
        `SUPABASE_URL`) lalu muat ulang halaman.
      </p>
    </div>
  );
}

export default async function Beranda() {
  let katalog;
  try {
    katalog = await muatKatalog();
  } catch {
    return <GalatDb />;
  }

  const poAktif = katalog.batchList.filter((b) => b.status === "po_dibuka");
  const jumlahBatchNegara = (kode: string) =>
    katalog.batchList.filter((b) => katalog.komponenList.find((k) => k.id === b.komponenId)?.negara === kode).length;

  return (
    <>
      <section className="wadah hero">
        <div>
          <h1>PO K-pop dari luar negeri, rapi dan bisa dipantau.</h1>
          <p className="bagian-pengantar">
            PawFox GO ngurusin album, merch, dan barang resmi dari Thailand, Korea Selatan, China, dan Jepang. Cek batch
            yang lagi jalan, hitung kursnya, dan pantau posisi barang dari warehouse sampai tiba di Indonesia.
          </p>
          <div className="hero-aksi">
            <Link className="tombol" href="/po">
              Lihat PO yang lagi buka
            </Link>
            <Link className="tombol tombol-kedua" href="/tracking">
              Cek posisi batch
            </Link>
          </div>
        </div>
        <div className="hero-logo">
          <img
            src="/logo.png"
            alt="Logo PawFox GO: puppy dan fox chibi bertengger di lingkaran paw"
            className="logo-blend"
            width={300}
            height={300}
          />
        </div>
      </section>

      <section className="wadah bagian" aria-labelledby="judul-po-aktif">
        <h2 id="judul-po-aktif">PO yang lagi buka</h2>
        {poAktif.length === 0 ? (
          <div className="kosong">
            <p>Belum ada PO yang buka sekarang.</p>
            <p>
              Pengumuman PO baru selalu lewat X:{" "}
              <a href={KONTAK.x} target="_blank" rel="noreferrer">
                {KONTAK.xHandle}
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-po">
            {poAktif.map((b) => {
              const info = katalog.lengkap(b.id)!;
              const slot = {
                terisi: b.items.reduce((a, i) => a + i.terisi, 0),
                kuota: b.items.reduce((a, i) => a + i.kuota, 0),
              };
              return (
                <article key={b.id} className="kartu kartu-angkat po-kartu">
                  <div className="po-kartu-atas">
                    <span className="chip">{info.negara.nama}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <h3 className="po-kartu-nama">{b.nama}</h3>
                  <Countdown tutupPo={b.tutupPo} />
                  <p className="po-kartu-meta">
                    {slot.terisi}/{slot.kuota} slot terisi · kurs GO 1 {info.negara.mataUang} = {formatRupiah(b.kursGo)}
                  </p>
                  <div className="po-kartu-aksi">
                    <Link className="tombol" href={`/po/${b.slug}`}>
                      Lihat batch
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="wadah bagian" aria-labelledby="judul-negara">
        <h2 id="judul-negara">Pilih negara</h2>
        <p className="bagian-pengantar">Tiap negara punya komponen dan batch sendiri, dengan mata uangnya masing-masing.</p>
        <div className="grid grid-negara">
          {katalog.negaraList.map((n) => {
            const jumlah = jumlahBatchNegara(n.kode);
            return (
              <Link key={n.kode} href={`/po#negara-${n.kode}`} className="kartu negara-kartu">
                <h3>{n.nama}</h3>
                <p className="po-kartu-meta">Mata uang: {n.mataUang}</p>
                <p className="po-kartu-meta negara-jumlah">
                  <PawIkon className="paw-kecil" />
                  {jumlah > 0 ? `${jumlah} batch` : "Belum ada batch"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wadah bagian" aria-labelledby="judul-kurs">
        <h2 id="judul-kurs">Hitung cepat</h2>
        <p className="bagian-pengantar">
          Ketik angkanya, langsung jadi rupiah. Kurs GO tiap batch dihitung terpisah di halaman batchnya.
        </p>
        <KalkulatorKurs ringkas />
      </section>
    </>
  );
}
