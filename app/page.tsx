import Link from "next/link";
import FormReview from "@/components/FormReview";
import Ikon from "@/components/Ikon";
import KalkulatorKurs from "@/components/KalkulatorKurs";
import AlurPaket from "@/components/beranda/AlurPaket";
import BatchBuka from "@/components/beranda/BatchBuka";
import DindingReview from "@/components/beranda/DindingReview";
import HeroRute from "@/components/beranda/HeroRute";
import { muatKatalog, semuaReviewTampil } from "@/lib/db";
import { dataHero, keTiket, masihBuka } from "@/lib/tampilan";

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

  const sekarang = Date.now();
  const tiketBuka = katalog.batchList.filter((b) => masihBuka(b, sekarang)).map((b) => keTiket(katalog, b, sekarang));
  const hero = dataHero(katalog, sekarang);
  const heroAwal = hero.find((n) => n.buka > 0)?.kode ?? hero[0]?.kode ?? "TH";
  const reviews = await semuaReviewTampil();

  return (
    <>
      <section className="wadah hero" aria-labelledby="judul-hero">
        <div className="hero-teks">
          <h1 id="judul-hero" className="hero-judul">
            Jajan Album &amp; POB A2O SOUL Lintas Negara, <span className="hero-sorot">Tanpa Drama Tracking.</span>
          </h1>
          <p className="hero-sub">
            Group order personal untuk album, POB A2O SOUL, dan photocard resmi dari Korea Selatan, China, Thailand, dan
            Jepang. Rate GO tiap batch dikunci dari awal, dan posisi barangmu bisa dipantau dari warehouse negara asal
            sampai tiba di Indonesia.
          </p>
          <div className="hero-aksi">
            <Link className="tombol tombol-besar" href="/po">
              Lihat PO yang lagi buka
              <Ikon nama="panah" className="tombol-panah" />
            </Link>
            <Link className="tombol tombol-kedua tombol-besar" href="/tracking">
              Lacak posisi paket
            </Link>
          </div>
        </div>
        {hero.length > 0 && <HeroRute negara={hero} awal={heroAwal} />}
      </section>

      <section id="batch-buka" className="wadah bagian bagian-batch" aria-labelledby="judul-po-aktif">
        <div className="kepala-bagian">
          <h2 id="judul-po-aktif">Ongoing batch</h2>
          <p className="bagian-pengantar">Batch yang masih menerima order. Rate GO di tiap tiket sudah dikunci.</p>
        </div>
        <BatchBuka tiket={tiketBuka} negara={katalog.negaraList.map((n) => ({ kode: n.kode, nama: n.nama }))} />
      </section>

      <section className="blok-gelap" aria-labelledby="judul-alur">
        <div className="wadah">
          <div className="kepala-bagian kepala-gelap">
            <h2 id="judul-alur">Alur jajan &amp; tracking</h2>
            <p className="bagian-pengantar">
              Dari ikut batch sampai paket di tanganmu. Pilih tiap langkah buat lihat apa yang terjadi di sana.
            </p>
          </div>
          <AlurPaket />
        </div>
      </section>

      <section className="wadah bagian bagian-hitung" aria-labelledby="judul-kurs">
        <div className="hitung-grid">
          <div className="kepala-bagian">
            <h2 id="judul-kurs">Hitung cepat</h2>
            <p className="bagian-pengantar">
              Ketik harga dalam KRW, CNY, THB, atau JPY, langsung jadi rupiah. Tabel rate lengkap ada di{" "}
              <Link href="/kalkulator">Kalkulator</Link>.
            </p>
          </div>
          <KalkulatorKurs ringkas />
        </div>
      </section>

      <section className="wadah bagian bagian-review" aria-labelledby="judul-review">
        <div className="kepala-bagian">
          <h2 id="judul-review">Kata buyer</h2>
          <p className="bagian-pengantar">Review dari buyer yang barangnya sudah sampai, ditampilkan setelah dicek admin.</p>
        </div>
        <div className="review-grid">
          <DindingReview reviews={reviews} />
          <FormReview batches={katalog.batchList.map((b) => ({ id: b.id, nama: b.nama }))} />
        </div>
      </section>
    </>
  );
}
