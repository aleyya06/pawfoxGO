import type { Metadata } from "next";
import KalkulatorKurs from "@/components/KalkulatorKurs";

export const metadata: Metadata = { title: "Kalkulator Kurs" };

export default function HalamanKalkulator() {
  return (
    <div className="wadah">
      <h1>Kalkulator Kurs</h1>
      <p className="bagian-pengantar">
        Konversi Baht, Won, Yuan, dan Yen ke rupiah (dan sebaliknya) dengan kurs live.
      </p>
      <KalkulatorKurs />
      <section className="bagian" aria-labelledby="judul-kurs-go">
        <h2 id="judul-kurs-go">Kurs live vs kurs GO</h2>
        <p>
          Kurs live di halaman ini adalah kurs pasar yang berganti tiap hari, dipakai buat gambaran cepat aja.
        </p>
        <p>
          Kurs GO itu beda: kurs yang aku tetapkan saat batch dibuka dan fix sampai PO tutup, supaya harga tidak
          goyah. Total bayar selalu pakai kurs GO batch masing-masing, yang tertera di halaman batch.
        </p>
      </section>
    </div>
  );
}
