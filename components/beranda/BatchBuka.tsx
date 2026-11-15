"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { KONTAK } from "@/lib/data";
import type { TiketData } from "@/lib/tampilan";
import StripNegara, { SEMUA } from "../StripNegara";
import TiketBatch from "../TiketBatch";

export default function BatchBuka({
  tiket,
  negara,
}: {
  tiket: TiketData[];
  negara: { kode: string; nama: string }[];
}) {
  const [aktif, setAktif] = useState(SEMUA);
  const tampil = aktif === SEMUA ? tiket : tiket.filter((t) => t.negaraKode === aktif);
  const negaraAktif = negara.find((n) => n.kode === aktif);

  const pilihan = [
    { kode: SEMUA, nama: "Semua", jumlah: tiket.length },
    ...negara.map((n) => ({ kode: n.kode, nama: n.nama, jumlah: tiket.filter((t) => t.negaraKode === n.kode).length })),
  ];

  return (
    <>
      <StripNegara pilihan={pilihan} aktif={aktif} onPilih={setAktif} label="Filter batch buka per negara" />
      <p className="sr-only" aria-live="polite">
        {negaraAktif ? `${tampil.length} batch buka dari ${negaraAktif.nama}` : `${tampil.length} batch buka`}
      </p>

      {tampil.length > 0 ? (
        <motion.div layout className={`tumpukan-tiket${tampil.length >= 3 ? " dua-kolom" : ""}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {tampil.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.25, 0.8, 0.3, 1] }}
              >
                <TiketBatch t={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="kosong kosong-tiket">
          {negaraAktif ? (
            <>
              <p className="kosong-judul">Belum ada PO buka dari {negaraAktif.nama}.</p>
              <p>
                Batch {negaraAktif.nama} yang sudah jalan bisa dipantau di{" "}
                <Link href={`/tracking?negara=${negaraAktif.kode}`}>Tracking</Link>. Pengumuman PO baru selalu lewat{" "}
                <a href={KONTAK.x} target="_blank" rel="noreferrer">
                  {KONTAK.xHandle}
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p className="kosong-judul">Belum ada PO yang buka sekarang.</p>
              <p>
                Pengumuman PO baru selalu lewat{" "}
                <a href={KONTAK.x} target="_blank" rel="noreferrer">
                  {KONTAK.xHandle}
                </a>
                . Posisi batch yang sudah jalan ada di <Link href="/tracking">Tracking</Link>.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
