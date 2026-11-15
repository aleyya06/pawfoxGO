// Bendera SVG kecil (30x20). Emoji bendera tidak tampil di Windows, jadi
// digambar sendiri. Disederhanakan untuk ukuran chip, bukan replika resmi.

function bintang(cx: number, cy: number, r: number, putar = -90): string {
  const titik: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = ((putar + i * 36) * Math.PI) / 180;
    const jari = i % 2 === 0 ? r : r * 0.38;
    titik.push(`${(cx + jari * Math.cos(rad)).toFixed(2)},${(cy + jari * Math.sin(rad)).toFixed(2)}`);
  }
  return titik.join(" ");
}

function Trigram({ x, y, sudut }: { x: number; y: number; sudut: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${sudut})`} fill="#181412">
      <rect x="-2.1" y="-1.45" width="4.2" height="0.7" />
      <rect x="-2.1" y="-0.35" width="4.2" height="0.7" />
      <rect x="-2.1" y="0.75" width="4.2" height="0.7" />
    </g>
  );
}

const GAMBAR: Record<string, React.ReactNode> = {
  ID: (
    <>
      <rect width="30" height="10" fill="#CE1126" />
      <rect y="10" width="30" height="10" fill="#FFFFFF" />
    </>
  ),
  TH: (
    <>
      <rect width="30" height="20" fill="#A51931" />
      <rect y="3.33" width="30" height="13.34" fill="#F4F5F8" />
      <rect y="6.67" width="30" height="6.66" fill="#2D2A4A" />
    </>
  ),
  JP: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </>
  ),
  CN: (
    <>
      <rect width="30" height="20" fill="#EE1C25" />
      <polygon points={bintang(5, 5, 3)} fill="#FFDE00" />
      <polygon points={bintang(10, 2, 1)} fill="#FFDE00" />
      <polygon points={bintang(12, 4, 1)} fill="#FFDE00" />
      <polygon points={bintang(12, 7, 1)} fill="#FFDE00" />
      <polygon points={bintang(10, 9, 1)} fill="#FFDE00" />
    </>
  ),
  KR: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <g transform="rotate(33.69 15 10)">
        <circle cx="15" cy="10" r="5" fill="#0047A0" />
        <path d="M10 10a5 5 0 0 1 10 0z" fill="#CD2E3A" />
        <circle cx="12.5" cy="10" r="2.5" fill="#CD2E3A" />
        <circle cx="17.5" cy="10" r="2.5" fill="#0047A0" />
      </g>
      <Trigram x={7.5} y={5} sudut={-56.31} />
      <Trigram x={22.5} y={15} sudut={-56.31} />
      <Trigram x={22.5} y={5} sudut={56.31} />
      <Trigram x={7.5} y={15} sudut={56.31} />
    </>
  ),
};

export default function Bendera({ kode, className }: { kode: string; className?: string }) {
  const gambar = GAMBAR[kode];
  if (!gambar) return null;
  return (
    <span className={className ? `bendera ${className}` : "bendera"} aria-hidden="true">
      <svg viewBox="0 0 30 20" focusable="false">
        {gambar}
      </svg>
    </span>
  );
}
