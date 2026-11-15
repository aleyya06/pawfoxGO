import Link from "next/link";
import { KONTAK } from "@/lib/data";
import Ikon from "./Ikon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wadah footer-dalam">
        <p className="footer-wordmark" aria-hidden="true">
          PawFox <span>GO</span>
        </p>

        <div className="footer-grid">
          <nav aria-label="Tautan footer" className="footer-tautan">
            <Link href="/po">PO &amp; Batch</Link>
            <Link href="/tracking">Tracking</Link>
            <Link href="/kalkulator">Kalkulator</Link>
          </nav>

          <div className="footer-kontak">
            <a className="footer-kartu" href={KONTAK.x} target="_blank" rel="noreferrer">
              <span className="footer-kartu-label mono">X</span>
              <span className="footer-kartu-isi">{KONTAK.xHandle}</span>
              <span className="footer-kartu-sub">Pengumuman PO baru dan DM order</span>
              <Ikon nama="luar" className="footer-kartu-ikon" />
              <span className="sr-only">(buka di tab baru)</span>
            </a>
            <a className="footer-kartu" href={`mailto:${KONTAK.email}`}>
              <span className="footer-kartu-label mono">Email</span>
              <span className="footer-kartu-isi">{KONTAK.email}</span>
              <span className="footer-kartu-sub">Buat pertanyaan yang panjang</span>
              <Ikon nama="surat" className="footer-kartu-ikon" />
            </a>
          </div>
        </div>

        <p className="footer-catatan">
          PawFox GO adalah group order personal yang dikelola satu orang, bukan toko resmi. Harga rupiah memakai rate
          GO per batch; update status selalu lewat halaman <Link href="/tracking">Tracking</Link>.
        </p>
      </div>
    </footer>
  );
}
