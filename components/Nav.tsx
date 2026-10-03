"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ModalMasuk from "./ModalMasuk";

export interface SesiNav {
  nama: string;
  avatarUrl?: string;
  admin: boolean;
}

const TAUTAN = [
  { href: "/", label: "Beranda" },
  { href: "/po", label: "PO & Batch" },
  { href: "/tracking", label: "Tracking" },
  { href: "/kalkulator", label: "Kalkulator" },
];

export default function Nav({ sesi }: { sesi: SesiNav | null }) {
  const pathname = usePathname();
  const [masukTerbuka, setMasukTerbuka] = useState(false);

  return (
    <header className="nav">
      <div className="nav-dalam wadah">
        <Link href="/" className="nav-brand">
          <img src="/logo.png" alt="Logo PawFox GO" className="logo-blend nav-logo" width={44} height={44} />
          <span className="nav-nama">PawFox GO</span>
        </Link>
        <nav aria-label="Navigasi utama">
          <ul className="nav-tautan">
            {TAUTAN.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className={`nav-link${pathname === t.href ? " aktif" : ""}`} aria-current={pathname === t.href ? "page" : undefined}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-auth">
          {sesi ? (
            <>
              <Link href="/profil" className="nav-link nav-profil">
                {sesi.avatarUrl && <img src={sesi.avatarUrl} alt="" className="nav-avatar" />}
                {sesi.nama}
              </Link>
              <form method="post" action="/api/auth/keluar">
                <button type="submit" className="nav-link tombol-teks">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <button type="button" className="nav-link nav-link-masuk" onClick={() => setMasukTerbuka(true)}>
              Masuk
            </button>
          )}
        </div>
      </div>
      <ModalMasuk terbuka={masukTerbuka} tutup={() => setMasukTerbuka(false)} />
    </header>
  );
}
