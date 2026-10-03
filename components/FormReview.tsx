"use client";

import { useActionState, useState } from "react";
import { aksiKirimReview, type HasilReview } from "@/app/actions";

export default function FormReview({ batches }: { batches: { id: string; nama: string }[] }) {
  const [hasil, aksi, lagimuat] = useActionState<HasilReview | null, FormData>(aksiKirimReview, null);
  const [bintang, setBintang] = useState(0);

  return (
    <form action={aksi} className="kartu form-review" aria-labelledby="judul-form-review">
      <h3 id="judul-form-review" className="form-review-judul">
        Tulis review kamu
      </h3>

      <div className="kalk-field">
        <span className="kalk-label" id="label-bintang">
          Bintang
        </span>
        <div className="pilih-bintang" role="radiogroup" aria-labelledby="label-bintang">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={bintang === n}
              aria-label={`${n} bintang`}
              className={`tombol-bintang${bintang >= n ? " aktif" : ""}`}
              onClick={() => setBintang(n)}
            >
              ★
            </button>
          ))}
          <span className="po-kartu-meta">{bintang > 0 ? `${bintang} dari 5` : "pilih dulu"}</span>
        </div>
        <input type="hidden" name="bintang" value={bintang} />
      </div>

      <div className="baris-form-review">
        <label className="kalk-field">
          Nama kamu
          <input name="nama" className="kalk-input" type="text" maxLength={60} required placeholder="Nama atau username" />
        </label>
        <label className="kalk-field">
          Batch
          <select name="batchId" className="kalk-input" required defaultValue="">
            <option value="" disabled>
              Pilih batch
            </option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nama}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="kalk-field">
        Ceritamu
        <textarea
          name="teks"
          className="kalk-input review-teks-input"
          rows={4}
          maxLength={500}
          required
          placeholder="Bagaimana pengalaman ordernya? Packing, kecepatan, komunikasi?"
        />
      </label>

      <button type="submit" className="tombol" disabled={lagimuat}>
        {lagimuat ? "Mengirim..." : "Kirim review"}
      </button>

      {hasil && (
        <p className={`kurs-status${hasil.ok ? "" : " gagal"}`} role="status">
          {hasil.pesan}
        </p>
      )}
    </form>
  );
}
