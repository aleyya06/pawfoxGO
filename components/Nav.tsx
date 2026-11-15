"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Ikon from "./Ikon";
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

function aktif(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav({ sesi }: { sesi: SesiNav | null }) {
  const pathname = usePathname();
  const [masukTerbuka, setMasukTerbuka] = useState(false);
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const tombolMenu = useRef<HTMLButtonElement>(null);
  const lembar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuTerbuka(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuTerbuka) return;
    lembar.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuTerbuka(false);
        tombolMenu.current?.focus();
      }
    };
    const onKlik = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!lembar.current?.contains(target) && !tombolMenu.current?.contains(target)) setMenuTerbuka(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onKlik);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onKlik);
    };
  }, [menuTerbuka]);

  const akun = sesi ? (
    <>
      <Link href="/profil" className="nav-akun">
        {sesi.avatarUrl && <img src={sesi.avatarUrl} alt="" className="nav-avatar" />}
        <span>{sesi.nama}</span>
      </Link>
      <form method="post" action="/api/auth/keluar">
        <button type="submit" className="nav-akun nav-keluar">
          Keluar
        </button>
      </form>
    </>
  ) : (
    <button
      type="button"
      className="nav-akun"
      onClick={() => {
        setMenuTerbuka(false);
        setMasukTerbuka(true);
      }}
    >
      Masuk
    </button>
  );

  return (
    <header className="nav-luar">
      <div className="nav">
        <Link href="/" className="nav-brand" aria-label="PawFox GO, ke beranda">
          <img src="/logo.png" alt="" className="logo-blend nav-logo" width={40} height={40} />
          <span className="nav-nama">PawFox GO</span>
        </Link>

        <nav aria-label="Navigasi utama" className="nav-desktop">
          <ul className="nav-tautan">
            {TAUTAN.map((t) => {
              const ini = aktif(pathname, t.href);
              return (
                <li key={t.href}>
                  <Link href={t.href} className="nav-link" aria-current={ini ? "page" : undefined}>
                    {ini && (
                      <motion.span
                        layoutId="nav-penanda"
                        className="nav-penanda"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="nav-link-teks">{t.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav-kanan">
          <div className="nav-akun-desktop">{akun}</div>
          <Link href="/#batch-buka" className="tombol nav-cta">
            Cek Batch Buka
          </Link>
          <button
            ref={tombolMenu}
            type="button"
            className="nav-menu-tombol"
            aria-expanded={menuTerbuka}
            aria-controls="nav-lembar"
            onClick={() => setMenuTerbuka((v) => !v)}
          >
            <Ikon nama={menuTerbuka ? "tutup" : "menu"} />
            <span>Menu</span>
          </button>
        </div>

        <div id="nav-lembar" ref={lembar} className="nav-lembar" hidden={!menuTerbuka}>
          <nav aria-label="Navigasi utama (seluler)">
            <ul className="nav-lembar-tautan">
              {TAUTAN.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} aria-current={aktif(pathname, t.href) ? "page" : undefined}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/#batch-buka" className="tombol tombol-penuh" onClick={() => setMenuTerbuka(false)}>
            Cek Batch Buka
          </Link>
          <div className="nav-lembar-akun">{akun}</div>
        </div>
      </div>
      <ModalMasuk terbuka={masukTerbuka} tutup={() => setMasukTerbuka(false)} />
    </header>
  );
}
