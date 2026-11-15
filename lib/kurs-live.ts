"use client";

import { useEffect, useState } from "react";
import { KURS_CADANGAN, MATA_UANG_LUAR, type KodeMataUang } from "./data";
import { formatTanggalJam } from "./format";

export type Kurs = {
  sumber: "memuat" | "live" | "cadangan";
  idrPer: Partial<Record<KodeMataUang, number>>;
  waktu?: string;
};

const KUNCI_CACHE = "pawfox-kurs-v1";
const USIA_CACHE = 12 * 60 * 60 * 1000;

async function muatKurs(): Promise<Kurs> {
  try {
    const cache = localStorage.getItem(KUNCI_CACHE);
    if (cache) {
      const data = JSON.parse(cache);
      if (Date.now() - data.simpanPada < USIA_CACHE && data.idrPer) {
        return { sumber: "live", idrPer: data.idrPer, waktu: data.waktu };
      }
    }
  } catch {
    // cache rusak atau penyimpanan diblokir: langsung fetch saja
  }
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/IDR");
    const json = await res.json();
    if (json?.result !== "success") throw new Error("respons tidak sukses");
    const idrPer: Partial<Record<KodeMataUang, number>> = {};
    for (const k of MATA_UANG_LUAR) {
      const rate = json.rates?.[k];
      if (typeof rate === "number" && rate > 0) idrPer[k] = 1 / rate;
    }
    if (Object.keys(idrPer).length === 0) throw new Error("rates kosong");
    const waktu = formatTanggalJam(json.time_last_update_unix ?? Date.now() / 1000);
    try {
      localStorage.setItem(KUNCI_CACHE, JSON.stringify({ idrPer, waktu, simpanPada: Date.now() }));
    } catch {
      // penyimpanan penuh: kurs tetap terpakai selama halaman terbuka
    }
    return { sumber: "live", idrPer, waktu };
  } catch {
    return { sumber: "cadangan", idrPer: { ...KURS_CADANGAN } };
  }
}

// Hero dan kalkulator di beranda sama-sama butuh rate. Satu permintaan
// dipakai bersama supaya API tidak dipanggil dua kali untuk satu halaman.
let permintaan: { janji: Promise<Kurs>; mulai: number } | null = null;

export function useKursLive(): Kurs {
  const [kurs, setKurs] = useState<Kurs>({ sumber: "memuat", idrPer: {} });

  useEffect(() => {
    let batal = false;
    if (!permintaan || Date.now() - permintaan.mulai > USIA_CACHE) {
      permintaan = { janji: muatKurs(), mulai: Date.now() };
    }
    const sekarang = permintaan;
    sekarang.janji.then((k) => {
      // Rate cadangan jangan dipakai bersama selamanya: halaman berikutnya boleh mencoba live lagi.
      if (k.sumber === "cadangan" && permintaan === sekarang) permintaan = null;
      if (!batal) setKurs(k);
    });
    return () => {
      batal = true;
    };
  }, []);

  return kurs;
}
