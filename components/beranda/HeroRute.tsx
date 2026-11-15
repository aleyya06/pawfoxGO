"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatRate } from "@/lib/format";
import { useKursLive } from "@/lib/kurs-live";
import { IATA_TUJUAN, type NegaraHero } from "@/lib/tampilan";
import Bendera from "../Bendera";

type Titik = { x: number; y: number };

// Posisi diproyeksikan kasar dari bujur/lintang tiap bandara supaya bentuk
// rutenya jujur (Bangkok di barat, Tokyo paling timur, Jakarta di selatan).
const BANDARA: Record<string, Titik & { label: Titik }> = {
  BKK: { x: 48, y: 146, label: { x: 58, y: 140 } },
  ICN: { x: 202, y: 27, label: { x: 172, y: 18 } },
  PVG: { x: 175, y: 59, label: { x: 146, y: 72 } },
  NRT: { x: 282, y: 35, label: { x: 254, y: 56 } },
};
const CGK = { x: 84, y: 236 };

// Titik kendali kurva tiap busur ke CGK.
const KENDALI: Record<string, Titik> = {
  BKK: { x: 26, y: 205 },
  ICN: { x: 192, y: 165 },
  PVG: { x: 152, y: 172 },
  NRT: { x: 250, y: 196 },
};

function jalur(iata: string): string {
  const a = BANDARA[iata];
  const k = KENDALI[iata];
  return `M${a.x} ${a.y} Q${k.x} ${k.y} ${CGK.x} ${CGK.y}`;
}

function bezier(t: number, a: number, k: number, b: number): number {
  return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * k + t * t * b;
}

export default function HeroRute({ negara, awal }: { negara: NegaraHero[]; awal: string }) {
  const [aktif, setAktif] = useState(awal);
  const kurs = useKursLive();
  const kurangiGerak = useReducedMotion();
  const pilihan = negara.find((n) => n.kode === aktif) ?? negara[0];

  // Tilt kartu mengikuti mouse; layar sentuh dan "kurangi gerak" tetap datar.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 160, damping: 18 });

  // Satu titik terbang dari bandara asal ke CGK setiap kali negara dipilih,
  // lalu berhenti. Tidak ada animasi berulang.
  const titikX = useMotionValue(CGK.x);
  const titikY = useMotionValue(CGK.y);
  const titikOpacity = useMotionValue(0);
  const pertama = useRef(true);

  useEffect(() => {
    if (pertama.current) {
      pertama.current = false;
      return;
    }
    if (kurangiGerak || !pilihan) return;
    const a = BANDARA[pilihan.iata];
    const k = KENDALI[pilihan.iata];
    titikOpacity.set(1);
    const kontrol = animate(0, 1, {
      duration: 1.5,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (t) => {
        titikX.set(bezier(t, a.x, k.x, CGK.x));
        titikY.set(bezier(t, a.y, k.y, CGK.y));
      },
      onComplete: () => {
        animate(titikOpacity, 0, { duration: 0.4 });
      },
    });
    return () => kontrol.stop();
    // Hanya pilihan negara yang memicu terbang; perubahan rate atau setelan gerak tidak.
  }, [aktif]);

  if (!pilihan) return null;
  const rate = kurs.idrPer[pilihan.mataUang];

  return (
    <div
      className="hero-panggung"
      onPointerMove={(e) => {
        if (kurangiGerak || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div className="waybill" style={{ rotateX, rotateY, transformPerspective: 1200 }}>
        <div className="waybill-kepala">
          <span className="waybill-jenis">Air waybill</span>
          <span className="waybill-rute mono">
            BKK · ICN · PVG · NRT <span aria-hidden="true">→</span>
            <span className="sr-only">ke</span> {IATA_TUJUAN}
          </span>
        </div>

        <div className="waybill-peta">
          <svg
            viewBox="-96 -4 410 268"
            role="img"
            aria-label={`Peta rute dari ${pilihan.nama} (${pilihan.iata}) ke Jakarta (${IATA_TUJUAN})`}
          >
            {negara.map((n) => (
              <path key={n.iata} d={jalur(n.iata)} className="peta-busur" />
            ))}
            <motion.path
              key={pilihan.iata}
              d={jalur(pilihan.iata)}
              className="peta-busur-aktif"
              initial={{ pathLength: kurangiGerak ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
            />
            {negara.map((n) => {
              const b = BANDARA[n.iata];
              const ini = n.kode === pilihan.kode;
              return (
                <g key={n.iata} className={ini ? "peta-bandara aktif" : "peta-bandara"}>
                  {ini && <circle cx={b.x} cy={b.y} r={10} className="peta-cincin" />}
                  <circle cx={b.x} cy={b.y} r={ini ? 5.5 : 4} />
                  <text x={b.label.x} y={b.label.y} className="peta-label">
                    {n.iata}
                  </text>
                </g>
              );
            })}
            <g className="peta-bandara peta-tujuan">
              <circle cx={CGK.x} cy={CGK.y} r={6} />
              <text x={CGK.x + 12} y={CGK.y + 4} className="peta-label">
                {IATA_TUJUAN}
              </text>
            </g>
            <motion.circle r={4.5} cx={titikX} cy={titikY} style={{ opacity: titikOpacity }} className="peta-paket" />
          </svg>

          <div className="emblem">
            <div className="emblem-cincin">
              <span className="emblem-wajah">
                <img src="/logo.png" alt="Logo PawFox GO: puppy dan fox chibi" className="logo-blend" width={120} height={120} />
              </span>
            </div>
            <span className="emblem-stempel mono">
              <span>GO PERSONAL</span>
              <span>@pawfoxgo</span>
            </span>
          </div>
        </div>

        <div className="waybill-pilih" role="group" aria-label="Pilih negara asal">
          {negara.map((n) => (
            <button
              key={n.kode}
              type="button"
              className="waybill-negara"
              aria-pressed={n.kode === pilihan.kode}
              onClick={() => setAktif(n.kode)}
            >
              <Bendera kode={n.kode} />
              <span className="mono">{n.kode}</span>
              <span className="sr-only">{n.nama}</span>
            </button>
          ))}
        </div>

        <dl className="waybill-data" aria-live="polite">
          <div>
            <dt>Asal</dt>
            <dd>
              <span className="mono">{pilihan.iata}</span> {pilihan.nama}
            </dd>
          </div>
          <div>
            <dt>Batch buka</dt>
            <dd className="mono">{pilihan.buka}</dd>
          </div>
          <div>
            <dt>Rate live</dt>
            <dd className="mono">
              {kurs.sumber === "memuat"
                ? "memuat..."
                : rate
                  ? `1 ${pilihan.mataUang} = ${formatRate(rate)}`
                  : "belum tersedia"}
              {kurs.sumber === "cadangan" && <span className="waybill-kecil"> (rate cadangan)</span>}
            </dd>
          </div>
          <div>
            <dt>Estimasi tiba</dt>
            <dd>
              {pilihan.estimasi ? (
                <>
                  <span className="mono">±{pilihan.estimasi.hari} hari</span> setelah checkout
                  <span className="waybill-kecil">dari {pilihan.estimasi.batchNama}</span>
                </>
              ) : (
                "Belum ada batch selesai"
              )}
            </dd>
          </div>
        </dl>
      </motion.div>
    </div>
  );
}
