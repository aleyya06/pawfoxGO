# PawFox GO

Website group order K-pop personal: katalog PO per negara (Thailand, Indonesia, Korea, China, Jepang), kalkulator kurs, tracking batch, cek pesanan tanpa login, dan review buyer.

Dibangun dengan Next.js + TypeScript. Data katalog, tracking, review, dan tagihan tersimpan di Supabase.

## Jalanin di lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk versi produksi: `npm run build` lalu `npm start`.

## Cara ganti data

Data harian diubah lewat Supabase Table Editor atau panel `/admin`:

- `countries` dan `components`: negara beserta kategorinya (album, POB, photocard).
- `batches`: tanggal buka/tutup PO, rate GO, status. Batch berstatus Open yang tanggal tutupnya sudah lewat otomatis tampil sebagai "Closed" sampai statusnya dipindah.
- `batch_items`: item per batch (nama, harga lokal, kuota, terisi). Item bernama `POB Photocard · <Nama Member>` tampil sebagai slot pooling per member, asalkan namanya ada di `A2O_SOUL_MEMBERS` (`lib/data.ts`).
- `tracking_updates`: riwayat status batch (status + catatan + tanggal). Urutan status ada di `STATUS_TRACKING` (`lib/data.ts`).
- `reviews`: review dari form beranda, tampil setelah admin menyalakan `tampil`.

`scripts/seed.mjs` mengisi katalog awal ke Supabase, dan `lib/katalog-cadangan.ts` dipakai kalau Supabase tidak terjangkau. Isi keduanya dijaga sama.

Kurs GO per batch dipakai menghitung harga rupiah (dibulatkan ke atas ke Rp500 terdekat). Kurs live di kalkulator otomatis dari open.er-api.com, cache 12 jam di browser buyer, dan ada kurs cadangan di `KURS_CADANGAN` kalau API-nya gagal.

## Halaman

- `/` beranda: PO yang lagi buka, pilih negara, kalkulator cepat.
- `/po` katalog per negara, `/po/[slug]` detail batch: harga, rincian biaya, countdown, timeline tracking, review.
- `/tracking` posisi terbaru semua batch.
- `/cek-pesanan` cari pakai kode order atau username + verifikasi 4 digit WA.
- `/kalkulator` konversi THB/KRW/CNY/JPY ke rupiah dan sebaliknya.

## Deploy

Paling gampang lewat Vercel: push ke GitHub, import di vercel.com, selesai. Tanpa environment variable apa pun di Fase ini.

## Menyusul (lihat SPEC.md)

- Fase 2: Supabase (order form, upload bukti transfer, panel admin), fee/DP diputuskan.
- Fase 3: QRIS dinamis otomatis via payment gateway, notifikasi status, insentif review.
