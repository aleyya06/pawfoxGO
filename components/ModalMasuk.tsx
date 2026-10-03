"use client";

import { useEffect, useRef } from "react";

export default function ModalMasuk({ terbuka, tutup }: { terbuka: boolean; tutup: () => void }) {
  const kartu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terbuka) return;
    kartu.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [terbuka, tutup]);

  if (!terbuka) return null;

  return (
    <div className="modal-overlay" onClick={tutup}>
      <div
        className="modal-kartu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-masuk-judul"
        ref={kartu}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-tutup" aria-label="Tutup" onClick={tutup}>
          ×
        </button>
        <h2 id="modal-masuk-judul" className="modal-judul">
          Masuk dulu ya
        </h2>
        <a className="tombol tombol-line tombol-penuh" href="/api/auth/line/start">
          Lanjut dengan LINE
        </a>
      </div>
    </div>
  );
}
