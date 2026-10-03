import { KONTAK } from "@/lib/data";
import PawIkon from "./PawIkon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wadah footer-dalam">
        <div className="footer-brand">
          <PawIkon className="footer-paw" />
          <span>PawFox GO</span>
        </div>
        <ul className="footer-kontak">
          <li>
            <a href={KONTAK.x} target="_blank" rel="noreferrer">
              X (Twitter): {KONTAK.xHandle}
            </a>
          </li>
          <li>
            <a href={`mailto:${KONTAK.email}`}>Email: {KONTAK.email}</a>
          </li>
        </ul>
        <p className="footer-note">Group order K-pop yang dikelola personal. Update status selalu lewat halaman tracking.</p>
      </div>
    </footer>
  );
}
