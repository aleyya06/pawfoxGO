import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./styles/tiket.css";
import "./styles/beranda.css";
import "./styles/kalkulator.css";
import Footer from "@/components/Footer";
import GerakProvider from "@/components/GerakProvider";
import Nav from "@/components/Nav";
import { profilSesi } from "@/lib/db";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PawFox GO: group order K-pop dari Thailand, Korea, China, dan Jepang",
    template: "%s | PawFox GO",
  },
  description:
    "Group order K-pop yang dikelola personal: lihat batch yang lagi jalan per negara, hitung kurs ke rupiah, pantau posisi barang dari warehouse sampai tiba di Indonesia, dan cek tagihanmu.",
};

export const viewport: Viewport = {
  themeColor: "#FAF6F0",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sesi = await profilSesi().catch(() => null);
  return (
    <html lang="id" className={`${jakarta.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#konten">
          Langsung ke konten
        </a>
        <GerakProvider>
          <Nav sesi={sesi ? { nama: sesi.nama, avatarUrl: sesi.avatarUrl, admin: sesi.isAdmin } : null} />
          <main id="konten" className="main">
            {children}
          </main>
        </GerakProvider>
        <Footer />
      </body>
    </html>
  );
}
