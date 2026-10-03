"use client";

import { useEffect, useMemo, useState } from "react";
import { KURS_CADANGAN, MATA_UANG, MATA_UANG_LUAR, type KodeMataUang } from "@/lib/data";
import { formatAngka, formatRupiah, formatTanggalJam } from "@/lib/format";

type Kurs = {
  sumber: "memuat" | "live" | "cadangan";
  idrPer: Partial<Record<KodeMataUang, number>>;
  waktu?: string;
};

const KUNCI_CACHE = "pawfox-kurs-v1";
const USIA_CACHE = 12 * 60 * 60 * 1000;

function parseJumlah(teks: string): number {
  const bersih = teks.replace(/\s/g, "").replace(",", ".");
  const n = Number.parseFloat(bersih);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function formatKurs(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: n < 100 ? 2 : 0,
  }).format(n);
}

export default function KalkulatorKurs({ ringkas = false }: { ringkas?: boolean }) {
  const [jumlahTeks, setJumlahTeks] = useState("10");
  const [kode, setKode] = useState<KodeMataUang>("CNY");
  const [arah, setArah] = useState<"ke_idr" | "dari_idr">("ke_idr");
  const [kurs, setKurs] = useState<Kurs>({ sumber: "memuat", idrPer: {} });

  useEffect(() => {
    let batal = false;

    async function muat() {
      try {
        const cache = localStorage.getItem(KUNCI_CACHE);
        if (cache) {
          const data = JSON.parse(cache);
          if (Date.now() - data.simpanPada < USIA_CACHE && data.idrPer) {
            if (!batal) setKurs({ sumber: "live", idrPer: data.idrPer, waktu: data.waktu });
            return;
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
        if (batal) return;
        setKurs({ sumber: "live", idrPer, waktu });
        try {
          localStorage.setItem(KUNCI_CACHE, JSON.stringify({ idrPer, waktu, simpanPada: Date.now() }));
        } catch {
          // penyimpanan penuh: kurs tetap terpakai selama halaman terbuka
        }
      } catch {
        if (!batal) setKurs({ sumber: "cadangan", idrPer: { ...KURS_CADANGAN } });
      }
    }

    muat();
    return () => {
      batal = true;
    };
  }, []);

  const jumlah = parseJumlah(jumlahTeks);
  const rate = kurs.idrPer[kode];
  const hasil = useMemo(() => {
    if (!rate) return null;
    return arah === "ke_idr" ? jumlah * rate : jumlah / rate;
  }, [rate, jumlah, arah]);

  return (
    <div className="kartu kartu-angkat kalk-panel">
      <div className="kalk-baris">
        <div className="kalk-field">
          <label htmlFor="kalk-jumlah">Jumlah</label>
          <input
            id="kalk-jumlah"
            className="kalk-input"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={jumlahTeks}
            onChange={(e) => setJumlahTeks(e.target.value)}
            placeholder="10"
          />
          <div className="segmen segmen-chip">
            {[10, 50, 100, 500].map((n) => (
              <button key={n} type="button" className="segmen-tombol chip-jumlah" onClick={() => setJumlahTeks(String(n))}>
                {formatAngka(n)}
              </button>
            ))}
          </div>
        </div>
        <div className="kalk-field" role="group" aria-label="Mata uang">
          <span className="kalk-label">Mata uang</span>
          <div className="segmen">
            {MATA_UANG_LUAR.map((k) => (
              <button key={k} type="button" className="segmen-tombol" aria-pressed={kode === k} onClick={() => setKode(k)}>
                {MATA_UANG[k].simbol}
              </button>
            ))}
          </div>
        </div>
        <div className="kalk-field" role="group" aria-label="Arah konversi">
          <span className="kalk-label">Arah</span>
          <div className="segmen">
            <button type="button" className="segmen-tombol" aria-pressed={arah === "ke_idr"} onClick={() => setArah("ke_idr")}>
              Ke rupiah
            </button>
            <button type="button" className="segmen-tombol" aria-pressed={arah === "dari_idr"} onClick={() => setArah("dari_idr")}>
              Dari rupiah
            </button>
          </div>
        </div>
      </div>

      <div className="kalk-hasil-wrap" aria-live="polite">
        {kurs.sumber === "memuat" ? (
          <p className="kurs-status">Mengambil kurs live...</p>
        ) : hasil === null || !rate ? (
          <p className="kurs-status">Kurs untuk {kode} belum tersedia, coba mata uang lain.</p>
        ) : (
          <>
            <p className="kalk-hasil">
              {arah === "ke_idr" ? formatRupiah(Math.round(hasil)) : `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: hasil < 1 ? 4 : 2 }).format(hasil)} ${MATA_UANG[kode].simbol}`}
            </p>
            <p className="kurs-status">
              {arah === "ke_idr"
                ? `1 ${kode} = ${formatKurs(rate)}, jadi ${formatAngka(jumlah)} ${kode} hasilnya di atas.`
                : `Rp1 = ${formatAngka(Math.round((1 / rate) * 10000) / 10000)} ${kode}, jadi ${formatRupiah(jumlah)} hasilnya di atas.`}
            </p>
          </>
        )}
      </div>

      <p className={`kurs-status${kurs.sumber === "cadangan" ? " gagal" : ""}`} role="status">
        {kurs.sumber === "live" && `Rate live dari open.er-api.com, diperbarui ${kurs.waktu}.`}
        {kurs.sumber === "cadangan" &&
          "Rate live gagal diambil, jadi yang terpakai rate cadangan kasar. Angkanya bisa beda dari kurs yang jalan sekarang."}
      </p>

      {!ringkas && (
        <div className="tabel-gulir">
          <table>
            <caption className="tabel-judul">Rate live hari ini (1 unit mata uang dalam rupiah)</caption>
            <thead>
              <tr>
                <th scope="col">Mata uang</th>
                <th scope="col" className="angka">1 unit =</th>
              </tr>
            </thead>
            <tbody>
              {MATA_UANG_LUAR.map((k) => (
                <tr key={k}>
                  <td>
                    {MATA_UANG[k].simbol} ({MATA_UANG[k].nama})
                  </td>
                  <td className="angka">{kurs.idrPer[k] ? formatKurs(kurs.idrPer[k]!) : "..."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
