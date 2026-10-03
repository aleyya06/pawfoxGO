# Spesifikasi: Website Group Order K-pop (PawFox GO)

Project folder: `pawfox`. Status: Fase 1 terbangun dan terverifikasi (2026-10-03), termasuk struktur Cek Pesanan dan review buyer.

Brand: **PawFox GO** (senada X @pawfoxgo). Suasana: **orange dan cream**, cute & hangat, tipografi membulat (Baloo 2 + Plus Jakarta Sans). Arah lengkap di `DESIGN.md`. Logo di `assets/logo/pawfox-logo-hd.png`, dipakai dengan `mix-blend-mode: multiply` supaya latar putihnya menyatu dengan cream. Kontak: X @pawfoxgo, email pawfox0512@gmail.com.

Website group order (GO) personal: satu organizer (kamu) sebagai admin tunggal, buyer tanpa akun. Buyer bisa lihat katalog PO per negara, hitung kurs, pantau tracking batch, cek pesanannya lewat search bar, dan baca review buyer.

Stack: Next.js + data terpusat di `lib/data.ts` (sekarang), Supabase menyusul di Fase 2 (Postgres, auth admin, storage bukti transfer), deploy Vercel. Kalkulator kurs jalan di browser, kurs live dari open.er-api.com dengan cache 12 jam dan kurs cadangan kalau gagal.

## Keputusan yang sudah fixed

- Skala personal dulu, bukan multi-organizer.
- Buyer tanpa akun: identitas = username unik + kode order. Login penuh/magic link baru dipertimbangkan di Fase 3.
- Pembayaran: QRIS statis + upload bukti + verifikasi manual dulu. Struktur tabel `payments` disiapkan supaya nanti tinggal colok payment gateway.
- Dua mode kurs: kurs live sebagai referensi, dan "kurs GO" per batch yang ditetapkan admin saat PO dibuka (dipakai untuk menghitung total order buyer).
- Bahasa UI: Indonesia.

## Struktur data

- `countries`: `id`, `code` (TH/ID/KR/CN/JP), `nama`, `mata_uang` (THB/IDR/KRW/CNY/JPY), `urutan`.
- `components`: `id`, `country_id`, `nama` (Album, Merch, Concert goods, dll), `deskripsi`, `urutan`.
- `batches`: `id`, `component_id`, `nomor`, `nama`, `buka_po_at`, `tutup_po_at`, `kurs_go`, `status`, `catatan`.
- `items`: `id`, `batch_id`, `nama`, `harga_lokal`, `kuota`, `foto_url`, `aktif`.
- `buyers`: `id`, `username` (unique, level database), `nama`, `wa_number`, `email` (opsional), `created_at`.
- `orders`: `id`, `kode` (unique, ada 4-5 karakter acak, bukan urut polos), `buyer_id`, `batch_id`, `total_idr`, `status` (menunggu_bayar, menunggu_verifikasi, lunas, dibatalkan, refund), `catatan`, `created_at`.
- `order_items`: `id`, `order_id`, `item_id`, `qty`, `harga_satuan_idr` (snapshot harga terkonversi saat order dibuat).
- `payments`: `id`, `order_id`, `bukti_url`, `status_verifikasi`, `verified_at`, `catatan_admin`.
- `tracking_updates`: `id`, `batch_id`, `status`, `catatan`, `foto_url`, `created_at`.
- `kurs_cache`: `mata_uang`, `rate_ke_idr`, `fetched_at`.

Status tracking batch (urut, konsisten, dipakai di seluruh UI):

1. PO dibuka
2. PO ditutup
3. Produksi / menunggu rilis
4. Sampai warehouse negara asal
5. Berangkat (departure)
6. OTW ke Indonesia (transit, customs)
7. Tiba di Indonesia
8. Sorting di warehouse lokal
9. Siap diambil / dikirim
10. Selesai

## Fitur per fase

### Fase 1: katalog dan tracking (publik, tanpa order)

- Beranda: semua PO yang sedang buka, dikelompokkan per negara.
- Halaman negara: daftar komponen, lalu daftar batch per komponen.
- Detail batch: daftar item (nama, harga lokal, harga terkonversi kurs GO, kuota "17/30 slot"), countdown tutup PO, rincian biaya transparan (harga item, ongkir lokal, ongkir internasional, fee).
- Kalkulator kurs: widget, pilih THB/KRW/CNY/JPY, ketik angka, keluar rupiah; ada mode kebalik (IDR ke mata uang lain). Sumber: kurs live (referensi) dan kurs GO batch terkait.
- Halaman tracking per batch: timeline status (desktop horizontal, mobile stepper vertikal), tiap perpindahan status punya catatan, foto opsional, dan tanggal "update terakhir".
- Admin dulu cukup lewat Supabase Studio, panel dibikin di Fase 2.
- **Cek Pesanan** (`/cek-pesanan`, struktur sudah terbangun): satu search bar menerima kode order (detail penuh: item, status bayar, total, link tracking) atau username (daftar ringkas; detail sensitif terbuka setelah verifikasi 4 digit terakhir nomor WA). Data order/buyer sekarang contoh berlabel di `lib/data.ts`, pindah ke Supabase di Fase 2.
- **Review buyer** (terbangun): kartu review berbintang di halaman batch, plus petunjuk cara buyer kirim review lewat DM. Data contoh berlabel di `lib/data.ts`.

### Fase 2: database Supabase, login LINE, tagihan (disiapkan, lihat `docs/PANDUAN-FASE2.md`)

- Data pindah dari `lib/data.ts` ke Supabase (Postgres). Skema siap di `supabase/schema.sql`. Update data lewat Supabase Table Editor (rasanya seperti spreadsheet) dan panel admin.
- **Login LINE**: buyer masuk pakai akun LINE (OAuth LINE Login, gratis), identitas tersimpan di tabel `profiles`. Kunci yang harus disiapkan organizer: project Supabase + channel LINE Login (panduan lengkap di `docs/PANDUAN-FASE2.md`). Semua halaman katalog (beranda, PO & Batch, Tracking) tetap publik tanpa login; login LINE opsional, dipakai buat halaman Tagihan dan pesanan yang nempel ke akun buyer.
- **Halaman Tagihan** untuk buyer yang login: tagihan belum dibayar, menunggu verifikasi, riwayat lunas, semuanya nempel ke akun LINE mereka. Tanpa fitur coin, sesuai keputusan organizer.
- Form order di web + upload bukti transfer; pembayaran pakai QRIS statis, verifikasi manual oleh admin dari panel.
- Admin panel sederhana: kelola batch/item, update tracking, bikin tagihan, centang bukti bayar lunas, kelola review yang tampil.
- Halaman "Cek Pesanan" tetap ada sebagai jalur buyer tanpa LINE: kode order (detail penuh) atau username + verifikasi 4 digit WA (pengecekan pindah ke server).

### Fase 3: otomatisasi (nanti)

- QRIS dinamis via payment gateway (Midtrans/Xendit/Duitku/Tripay, syarat dan fee dicek saat mau naik): QR unik per order, webhook menandai lunas otomatis tanpa centang manual, slot berkurang sendiri.
- Notifikasi status ke buyer (email, atau lewat LINE jika nanti dipasangkan dengan LINE Official Account).
- Insentif review tidak dibuat (organizer memutuskan tanpa fitur coin/poin).

## Yang masih terbuka (dimutuskan sebelum/di awal Fase 2)

- Fee organizer: masuk di harga, fee flat per order, atau dipisah terlihat. (Sekarang fee per slot terlihat di rincian biaya.)
- Sistem DP atau full payment di awal.
- Panel admin dan koneksi Supabase.
