# PawFox GO

Website group order K-pop personal: katalog PO per negara (Thailand, Indonesia, Korea, China, Jepang), kalkulator kurs, tracking batch, cek pesanan tanpa login, dan review buyer.

Dibangun dengan Next.js + TypeScript. Data dikelola lewat satu file: `lib/data.ts`.

## Jalanin di lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk versi produksi: `npm run build` lalu `npm start`.

## Cara ganti data

Semua data ada di `lib/data.ts` dan datanya sekarang masih contoh berlabel, tinggal diganti:

- `NEGARA` dan `KOMPONEN`: negara beserta komponennya (album, merch, dan lain-lain).
- `BATCH`: tiap batch punya tanggal buka/tutup PO, kurs GO, rincian biaya per slot (ongkir lokal, ongkir internasional, fee), `items` (nama, harga lokal, kuota, terisi), dan `tracking` (status + catatan + tanggal).
- `STATUS_TRACKING`: daftar 10 status tracking, urut dari PO dibuka sampai selesai. Status batch = posisi sekarang.
- `BUYER`, `PESANAN`, `REVIEW`: data buat halaman Cek Pesanan dan review. `PESANAN.kode` harus unik (dipakai buyer buat cari), `BUYER.empatDigitWa` dipakai verifikasi ringan di halaman cek pesanan.

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
