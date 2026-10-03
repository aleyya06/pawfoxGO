# Panduan Fase 2: Login LINE, Tagihan, dan Database

> **Status 2026-10-03 malam: kode Fase 2 SUDAH DIBANGUN** (login LINE, halaman Tagihan, panel admin, halaman publik baca dari Supabase, cek pesanan server-side). Yang tersisa cuma satu: koreksi `SUPABASE_URL` di `.env.local` dengan Project URL yang persis, lalu jalankan `node --env-file=.env.local scripts/seed.mjs` untuk isi data contoh. Setelah itu login pertama pakai akun LINE-mu otomatis jadi admin.

Panduan ini buat kamu jalani sendiri (sekitar 30-45 menit), karena butuh dua akun yang cuma kamu yang bisa bikin: Supabase (database) dan LINE Developers (login LINE). Setelah semua kunci ada, sisanya (kode login, halaman tagihan, panel admin) tinggal dibangunkan ke ZCode di sesi berikutnya.

## Gambaran besar

Sekarang semua data website masih tinggal di satu file kode (`lib/data.ts`), makanya mengubah isinya terasa ribet. Di Fase 2 data pindah ke database Supabase (Postgres di cloud, gratis untuk skala mulai), dan buyer bisa login pakai LINE supaya pesanan dan tagihan mereka nempel ke akun LINE masing-masing, seperti di GO BY CHONA.

Alurnya nanti:

1. Buyer klik "Masuk dengan LINE" di website.
2. LINE membuka aplikasi/akun LINE mereka, buyer setuju sekali.
3. Website menerima identitas LINE (nama, foto, id unik) dan menyimpannya sebagai profil.
4. Buyer yang sudah login punya halaman Tagihan: daftar batch yang belum dibayar, yang menunggu verifikasi, dan riwayat yang lunas.
5. Kamu (admin) bikin tagihan dari panel admin, buyer bayar lewat QRIS, kamu centang lunas. Verifikasi otomatis lewat gateway datang di Fase 3.

Fitur coin tidak dibuat, sesuai permintaanmu.

## Langkah 1: Bikin project Supabase

1. Buka supabase.com, daftar (bisa pakai GitHub atau email).
2. Klik New project. Nama bebas (misal `pawfox-go`), password database boleh digenerate dan disimpan, region pilih Singapore (paling dekat ke Indonesia).
3. Tunggu project selesai dibuat.

## Langkah 2: Pasang skema database

1. Di dashboard Supabase, buka menu SQL Editor.
2. Buka file `supabase/schema.sql` dari folder ini, salin seluruh isinya, tempel di SQL Editor, klik Run.
3. Kalau berhasil, menu Table Editor akan menampilkan tabel: profiles, countries, components, batches, batch_items, tracking_updates, orders, order_items, payments, reviews.

## Langkah 3: Ambil kunci Supabase

Buka Project Settings > API. Supabase sekarang memakai format kunci baru:

- Project URL (bentuknya `https://xxxx.supabase.co`)
- publishable key (diawali `sb_publishable_`, boleh terlihat publik)
- secret key (diawali `sb_secret_`, rahasia, jangan dibagikan ke siapa pun)

Simpan ketiganya ke `.env.local` (contoh isinya di Langkah 5). Status 2026-10-03: kunci Supabase sudah tersimpan di `.env.local`, tinggal cocokkan Project URL-nya.

## Langkah 4: Bikin channel LINE Login

1. Buka https://developers.line.biz/console/ (ini alamat resmi LINE Developers Console), login pakai akun LINE kamu. Kalau diminta melengkapi profil developer dulu, isi nama dan email.
2. Create a new provider (nama bebas, misal PawFox).
3. Di dalam provider, pilih Create a LINE Login channel. Isi nama dan deskripsi bebas.
4. Di tab LINE Login settings channel kamu:
   - Catat Channel ID dan Channel secret.
   - Di bagian Callback settings, isi callback URL: `http://localhost:3100/api/auth/line/callback` (port mengikuti server lokal yang dipakai; kalau nanti jalan di port 3000 tambahkan juga `http://localhost:3000/api/auth/line/callback`, dan setelah deploy tambahkan `https://domainmu.vercel.app/api/auth/line/callback`). Sudah diverifikasi 2026-10-03: website mengirim redirect_uri persis `http://localhost:3100/api/auth/line/callback`, jadi callback di LINE console harus memuat alamat itu.

LINE Login gratis. Tidak perlu LINE Official Account untuk fitur login ini.

## Langkah 5: Simpan kunci ke file `.env.local`

File `.env.local` di folder project sudah dibuat dan terisi kunci Supabase. Isinya sekarang:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
LINE_CHANNEL_ID=
LINE_CHANNEL_SECRET=
```

Yang masih kosong dua baris LINE di atas: isi setelah Langkah 4. File ini tidak ikut ter-upload (sudah masuk .gitignore), aman menyimpan rahasia di situ. Supabase URL sebaiknya dicek sekali: buka Project Settings > API, pastikan nilai `SUPABASE_URL` persis sama dengan Project URL yang ditampilkan.

## Langkah 6: Bangunkan ZCode

Buka sesi ZCode baru di folder ini, bilang saja: "kunci Supabase dan LINE sudah terisi di .env.local, bangun Fase 2 sesuai docs/PANDUAN-FASE2.md". Yang akan dibangun:

- Login LINE (tombol Masuk, callback, sesi login, profil tersimpan di tabel profiles).
- Halaman `/tagihan` untuk buyer yang login: tagihan belum dibayar, menunggu verifikasi, riwayat lunas.
- Panel admin sederhana untuk kamu: kelola batch, item, update tracking, bikin tagihan, centang bukti bayar lunas.
- Halaman publik (katalog, tracking, kalkulator, review) pindah membaca dari database.
- Cek Pesanan tetap ada untuk buyer yang tidak mau login LINE.

## Cara update data setelah Fase 2

Ada dua cara, dua-duanya tanpa koding:

1. **Supabase Studio** (bisa dipakai hari pertama juga): menu Table Editor terlihat seperti spreadsheet. Mau update tracking batch? Buka tabel tracking_updates, tambah baris baru, isi status dan catatan, Enter. Selesai, website langsung menampilkan yang baru.
2. **Panel admin di website kamu** (dibangun di Fase 2): form yang lebih ramah, khusus tugas-tugas yang sering (update tracking, verifikasi bayar, bikin tagihan).

## Catatan keamanan (singkat)

- Kunci service_role dan Channel secret hanya hidup di server (.env.local), tidak pernah sampai ke browser buyer.
- Halaman tagihan hanya menampilkan pesanan milik profil LINE yang sedang login.
- Verifikasi 4 digit WA di Cek Pesanan sifatnya ringan dan cukup untuk fase sekarang; setelah Supabase aktif, pengecekan pindah ke server supaya lebih aman.
