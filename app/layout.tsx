import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profilSesi } from "@/lib/db";

export const metadata: Metadata = {
  title: {
    default: "PawFox GO: group order K-pop dari Thailand, Korea, China, dan Jepang",
    template: "%s | PawFox GO",
  },
  description:
    "Group order K-pop yang dikelola personal: lihat batch yang lagi jalan per negara, hitung kurs ke rupiah, pantau posisi barang dari warehouse sampai tiba di Indonesia, dan cek tagihanmu.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sesi = await profilSesi().catch(() => null);
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#konten">
          Langsung ke konten
        </a>
        <Nav
          sesi={sesi ? { nama: sesi.nama, avatarUrl: sesi.avatarUrl, admin: sesi.isAdmin } : null}
        />
        <main id="konten" className="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
