"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useId, useMemo, useState } from "react";
import { MATA_UANG, type KodeMataUang } from "@/lib/data";
import { formatAngka, formatRate, formatRupiah } from "@/lib/format";
import { useKursLive } from "@/lib/kurs-live";
import Bendera from "./Bendera";
import Ikon from "./Ikon";

const NEGARA_MATA_UANG: Record<string, string> = { THB: "TH", KRW: "KR", CNY: "CN", JPY: "JP" };

// Won di depan karena sebagian besar batch berasal dari Korea.
const URUTAN_PILIHAN: KodeMataUang[] = ["KRW", "CNY", "THB", "JPY"];

function parseJumlah(teks: string): number {
  const bersih = teks.replace(/\s/g, "").replace(",", ".");
  const n = Number.parseFloat(bersih);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Menukar arah menerbangkan tag IDR dan tag mata uang asing ke kotak
// seberang, supaya jelas angka mana yang sekarang diketik.
function TagMataUang({ kode, idr }: { kode: KodeMataUang; idr: boolean }) {
  return (
    <motion.span layoutId={idr ? "tag-idr" : "tag-asing"} className="slip-tag mono" transition={{ type: "spring", stiffness: 380, damping: 30 }}>
      {idr ? "IDR" : kode}
    </motion.span>
  );
}

export default function KalkulatorKurs({ ringkas = false, judul = true }: { ringkas?: boolean; judul?: boolean }) {
  const [jumlahTeks, setJumlahTeks] = useState("10000");
  const [kode, setKode] = useState<KodeMataUang>("KRW");
  const [arah, setArah] = useState<"ke_idr" | "dari_idr">("ke_idr");
  const kurs = useKursLive();
  const id = useId();

  const jumlah = parseJumlah(jumlahTeks);
  const rate = kurs.idrPer[kode];
  const hasil = useMemo(() => {
    if (!rate) return null;
    return arah === "ke_idr" ? jumlah * rate : jumlah / rate;
  }, [rate, jumlah, arah]);
  const keIdr = arah === "ke_idr";

  return (
    <div className="slip">
      {judul && <p className="slip-judul">Kalkulator Kurs</p>}

      <div className="slip-mata-uang" role="group" aria-label="Mata uang asing">
        {URUTAN_PILIHAN.map((k) => (
          <button key={k} type="button" className="slip-mu" aria-pressed={kode === k} onClick={() => setKode(k)}>
            <Bendera kode={NEGARA_MATA_UANG[k]} />
            <span className="mono">{k}</span>
            <span className="slip-mu-nama">{MATA_UANG[k].nama}</span>
          </button>
        ))}
      </div>

      <LayoutGroup id={id}>
        <div className="slip-hitung">
          <div className="slip-kotak">
            <label htmlFor={`${id}-jumlah`} className="slip-label">
              {keIdr ? `Harga dalam ${MATA_UANG[kode].nama}` : "Budget dalam rupiah"}
            </label>
            <div className="slip-input-baris">
              <input
                id={`${id}-jumlah`}
                className="slip-input mono"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={jumlahTeks}
                onChange={(e) => setJumlahTeks(e.target.value)}
                placeholder="10000"
              />
              <TagMataUang key={keIdr ? "asing" : "idr"} kode={kode} idr={!keIdr} />
            </div>
          </div>

          <motion.button
            type="button"
            className="slip-tukar"
            onClick={() => setArah((a) => (a === "ke_idr" ? "dari_idr" : "ke_idr"))}
            aria-label={keIdr ? `Tukar arah: hitung dari rupiah ke ${kode}` : `Tukar arah: hitung dari ${kode} ke rupiah`}
            animate={{ rotate: keIdr ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <Ikon nama="tukar" />
          </motion.button>

          <div className="slip-kotak slip-kotak-hasil" aria-live="polite">
            <span className="slip-label">{keIdr ? "Kira-kira dalam rupiah" : `Kira-kira dalam ${MATA_UANG[kode].nama}`}</span>
            <div className="slip-input-baris">
              {kurs.sumber === "memuat" ? (
                <p className="slip-hasil slip-hasil-tunggu">Mengambil kurs live...</p>
              ) : hasil === null || !rate ? (
                <p className="slip-hasil slip-hasil-tunggu">Kurs untuk {kode} belum tersedia, coba mata uang lain.</p>
              ) : (
                <p className="slip-hasil mono">
                  {keIdr
                    ? formatRupiah(Math.round(hasil))
                    : new Intl.NumberFormat("id-ID", { maximumFractionDigits: hasil < 1 ? 4 : 2 }).format(hasil)}
                </p>
              )}
              <TagMataUang key={keIdr ? "idr" : "asing"} kode={kode} idr={keIdr} />
            </div>
          </div>
        </div>
      </LayoutGroup>

      {rate && kurs.sumber !== "memuat" && (
        <p className="slip-rumus mono">
          {keIdr ? `1 ${kode} = ${formatRate(rate)}` : `Rp1 = ${formatAngka(Math.round((1 / rate) * 10000) / 10000)} ${kode}`}
          {kurs.sumber === "live" && ` · rate live ${kurs.waktu}`}
        </p>
      )}

      <p className={`slip-catatan${kurs.sumber === "cadangan" ? " gagal" : ""}`} role="status">
        {kurs.sumber === "cadangan"
          ? "Rate live gagal diambil, jadi yang terpakai rate cadangan kasar. Angkanya bisa beda dari kurs yang jalan sekarang. "
          : "Rate pasar live dari open.er-api.com. "}
        Tagihan batch pakai rate GO yang dikunci saat batch dibuka, jadi angkanya bisa beda.
      </p>

      {!ringkas && (
        <div className="tabel-gulir slip-papan">
          <table>
            <caption className="tabel-judul">Rate live hari ini (1 unit mata uang dalam rupiah)</caption>
            <thead>
              <tr>
                <th scope="col">Mata uang</th>
                <th scope="col" className="angka">
                  1 unit =
                </th>
              </tr>
            </thead>
            <tbody>
              {URUTAN_PILIHAN.map((k) => (
                <tr key={k}>
                  <td>
                    <span className="sel-mata-uang">
                      <Bendera kode={NEGARA_MATA_UANG[k]} />
                      <span className="mono">{k}</span> {MATA_UANG[k].nama}
                    </span>
                  </td>
                  <td className="angka mono">{kurs.idrPer[k] ? formatRate(kurs.idrPer[k]!) : "..."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
