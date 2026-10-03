import { MATA_UANG, type KodeMataUang } from "./data";

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatAngka(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatTanggalJam(unixDetik: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(unixDetik * 1000));
}

export function simbol(k: KodeMataUang): string {
  return MATA_UANG[k].simbol;
}
