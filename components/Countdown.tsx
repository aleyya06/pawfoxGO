"use client";

import { useEffect, useState } from "react";
import { formatTanggal } from "@/lib/format";

function sisaWaktu(target: number): string {
  const selisih = target - Date.now();
  if (selisih <= 0) return "PO sudah ditutup";
  const hari = Math.floor(selisih / 86400000);
  const jam = Math.floor((selisih % 86400000) / 3600000);
  if (hari > 0) return `Tutup PO dalam ${hari} hari ${jam} jam lagi`;
  const menit = Math.floor((selisih % 3600000) / 60000);
  return `Tutup PO dalam ${jam} jam ${menit} menit lagi`;
}

export default function Countdown({ tutupPo }: { tutupPo: string }) {
  const [teks, setTeks] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date(`${tutupPo}T23:59:59`).getTime();
    const perbarui = () => setTeks(sisaWaktu(target));
    perbarui();
    const id = setInterval(perbarui, 30000);
    return () => clearInterval(id);
  }, [tutupPo]);

  return (
    <p className="countdown" suppressHydrationWarning>
      {teks ?? `Tutup PO: ${formatTanggal(tutupPo)}`}
    </p>
  );
}
