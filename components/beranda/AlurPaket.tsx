"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import Ikon, { type NamaIkon } from "../Ikon";

// Empat langkah yang dialami buyer. Tiap langkah menyebut status tracking
// asli yang dipakai admin, supaya buyer bisa mencocokkan dengan halaman Tracking.
// Isi jaminannya hanya yang terbukti di data atau dikonfirmasi organizer.
const LANGKAH: {
  judul: string;
  ikon: NamaIkon;
  status: string;
  isi: string;
  jaminan: string;
}[] = [
  {
    judul: "Ikut batch PO",
    ikon: "kotak",
    status: "Open → Done checkout",
    isi: "Pilih item di batch yang lagi buka, lalu DM admin. Tagihannya dihitung pakai rate GO yang dikunci sejak batch dibuka, dan dibayar lewat QRIS dari admin.",
    jaminan: "Rate GO tidak berubah selama batch jalan.",
  },
  {
    judul: "Tiba di warehouse luar negeri",
    ikon: "gudang",
    status: "Arrived WH negara asal",
    isi: "Setelah batch ditutup dan semua buyer checkout, toko mengirim barang ke warehouse di negara asal. Begitu sampai, statusnya pindah dan catatannya muncul di halaman batch.",
    jaminan: "Tiap perpindahan status ada tanggal dan catatannya.",
  },
  {
    judul: "Perjalanan ke Indonesia",
    ikon: "pesawat",
    status: "Arrived Indonesia",
    isi: "Barang berangkat dari warehouse, lewat bea cukai, lalu tiba di Indonesia. Kamu nggak perlu nanya posisi: admin menulis update setiap status pindah.",
    jaminan: "Update setiap status pindah, terbuka di halaman Tracking.",
  },
  {
    judul: "Packing, lalu diambil atau dikirim ke rumahmu",
    ikon: "rumah",
    status: "Arrived admin",
    isi: "Barang sampai di admin dan dibagi per buyer. Sebelum dikirim, pesananmu dibungkus bubble wrap berlapis. Mau ambil sendiri juga bisa.",
    jaminan: "Bubble wrap berlapis sebelum dikirim.",
  },
];

export default function AlurPaket() {
  const [aktif, setAktif] = useState(0);
  const id = useId();
  const tab = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let n: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % LANGKAH.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + LANGKAH.length) % LANGKAH.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = LANGKAH.length - 1;
    if (n === null) return;
    e.preventDefault();
    setAktif(n);
    tab.current[n]?.focus();
  }

  const progres = aktif / (LANGKAH.length - 1);
  const langkah = LANGKAH[aktif];

  return (
    <div className="alur">
      <div className="alur-rel" role="tablist" aria-label="Empat langkah paket">
        <div className="alur-garis" aria-hidden="true">
          <motion.span
            className="alur-garis-isi"
            animate={{ scaleX: progres }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
          <motion.span
            className="alur-garis-isi alur-garis-tegak"
            animate={{ scaleY: progres }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
        {LANGKAH.map((l, i) => (
          <button
            key={l.judul}
            ref={(el) => {
              tab.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={aktif === i}
            aria-controls={`${id}-panel`}
            tabIndex={aktif === i ? 0 : -1}
            className="alur-langkah"
            data-lewat={i <= aktif || undefined}
            onClick={() => setAktif(i)}
            onMouseEnter={() => setAktif(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="alur-nomor mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="alur-bulat">
              <Ikon nama={l.ikon} />
            </span>
            <span className="alur-judul">{l.judul}</span>
          </button>
        ))}
      </div>

      <div className="alur-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${aktif}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={aktif}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
            className="alur-panel-isi"
          >
            <p className="alur-status mono">Status di tracking: {langkah.status}</p>
            <h3 className="alur-panel-judul">{langkah.judul}</h3>
            <p>{langkah.isi}</p>
            <p className="alur-jaminan">{langkah.jaminan}</p>
          </motion.div>
        </AnimatePresence>
        <p className="alur-tautan">
          <Link href="/tracking">Lihat posisi semua batch di Tracking</Link>
        </p>
      </div>
    </div>
  );
}
