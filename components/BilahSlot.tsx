"use client";

import { motion } from "framer-motion";

// Bilah terisi dari kiri saat pertama terlihat, supaya mata langsung
// menangkap seberapa penuh batch. Di halaman yang sering dibuka ulang
// (detail batch) bilahnya langsung penuh tanpa gerak.
export default function BilahSlot({
  terisi,
  kuota,
  gerak = true,
}: {
  terisi: number;
  kuota: number;
  gerak?: boolean;
}) {
  const rasio = kuota > 0 ? Math.min(1, terisi / kuota) : 0;
  return (
    <div className="bilah-slot">
      <p className="bilah-slot-teks">
        <span className="mono">
          {terisi}/{kuota}
        </span>{" "}
        slot terisi
      </p>
      <div className="bilah-slot-jalur" aria-hidden="true">
        {gerak ? (
          <motion.span
            className="bilah-slot-isi"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: rasio }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.25, 0.8, 0.3, 1] }}
          />
        ) : (
          <span className="bilah-slot-isi" style={{ transform: `scaleX(${rasio})` }} />
        )}
      </div>
    </div>
  );
}
