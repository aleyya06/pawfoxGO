"use client";

import type { KodeMataUang } from "@/lib/data";
import { formatRate } from "@/lib/format";
import { useKursLive } from "@/lib/kurs-live";

// Rate live satu mata uang, dipajang di samping rate GO supaya selisihnya kelihatan.
export default function RateLiveSingkat({ kode }: { kode: KodeMataUang }) {
  const kurs = useKursLive();
  const rate = kurs.idrPer[kode];
  if (kurs.sumber === "memuat") return <span className="rate-live-singkat">rate live: memuat...</span>;
  if (!rate) return <span className="rate-live-singkat">rate live belum tersedia</span>;
  return (
    <span className="rate-live-singkat">
      rate {kurs.sumber === "cadangan" ? "cadangan" : "live"}: <span className="mono">{formatRate(rate)}</span>
    </span>
  );
}
