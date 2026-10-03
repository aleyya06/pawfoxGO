import type { Metadata } from "next";
import KalkulatorKurs from "@/components/KalkulatorKurs";

export const metadata: Metadata = { title: "Kalkulator Rate" };

export default function HalamanKalkulator() {
  return (
    <div className="wadah">
      <h1>Kalkulator Rate</h1>
      <p className="bagian-pengantar">
        Konversi Baht, Won, Yuan, dan Yen ke rupiah (dan sebaliknya) dengan rate live.
      </p>
      <KalkulatorKurs />
      <section className="bagian" aria-labelledby="judul-kurs-go">
        <h2 id="judul-kurs-go">Rate live vs rate GO</h2>
        <p>
          Rate live di halaman ini adalah rate pasar yang berganti tiap hari, dipakai buat gambaran cepat aja.
        </p>
      </section>
    </div>
  );
}
