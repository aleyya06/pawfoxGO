// Set ikon PawFox GO: garis 2.25 dengan ujung membulat, senada outline tebal
// logo chibi. Cuma ikon yang benar-benar dipakai halaman.
const JALUR = {
  pesawat: (
    <path d="M12 2.6c.9 0 1.5 1 1.5 2.2v4.3l7 4.1v2.1l-7-2v4.3l2.2 1.7v1.7L12 20.2 8.3 21v-1.7l2.2-1.7v-4.3l-7 2v-2.1l7-4.1V4.8c0-1.2.6-2.2 1.5-2.2Z" />
  ),
  gudang: (
    <>
      <path d="M3 10.5 12 5l9 5.5V20H3z" />
      <path d="M7 20v-6h10v6M7 17h10" />
    </>
  ),
  kotak: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.2l8.4 4.6" />
    </>
  ),
  rumah: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  tutup: <path d="M6 6l12 12M18 6 6 18" />,
  luar: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  tukar: <path d="M7 4v15M3.5 15.5 7 19l3.5-3.5M17 20V5M13.5 8.5 17 5l3.5 3.5" />,
  surat: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  panah: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export type NamaIkon = keyof typeof JALUR;

export default function Ikon({ nama, className }: { nama: NamaIkon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ? `ikon ${className}` : "ikon"}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {JALUR[nama]}
    </svg>
  );
}
