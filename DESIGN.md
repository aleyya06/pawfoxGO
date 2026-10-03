# DESIGN.md: PawFox GO

Arah desain resmi PawFox GO. Filter antislop berlaku di atas arah ini.

## Identitas

- Nama tampilan: PawFox GO (senada akun X @pawfoxgo, pilihan user).
- Produk: website group order K-pop personal, satu organizer.
- Kontak: X @pawfoxgo, email pawfox0512@gmail.com.
- Logo: puppy + fox chibi bertengger di lingkaran paw besar (`assets/logo/pawfox-logo-hd.png`). Background putih logo disembunyikan dengan CSS `mix-blend-mode: multiply` di atas latar cream, tanpa perlu mengedit gambar.

## Kepribadian

- Cute & hangat (pilihan user): ramah, santai, tidak formal, senada karakter logo chibi.
- Bahasa Indonesia kasual yang tetap sopan; istilah GO (PO, slot, kurs) dipakai secara wajar.

## Palet (diambil langsung dari warna asli logo)

- Orange utama `#EC884A` (bulu fox): tombol utama, highlight, aksen aktif.
- Cream dasar `#FBF3E4`: latar halaman. Cream permukaan `#FEFAE2`: kartu.
- Coklat tua `#47241E` (outline logo): semua teks, heading, border tegas.
- Coklat sedang `#975737`: teks sekunder, garis bantu.
- Blush `#F5C6CC` (blush logo): aksen kecil untuk status positif (lunas, selesai).

Alasan: palet = warna asli logo, jadi logo nyemplung tanpa kotak latar. Teks selalu coklat tua di atas cream atau orange (kontras aman); orange tidak pernah jadi warna teks di atas cream karena kontrasnya gagal WCAG.

## Tipografi

- Judul: Baloo 2 (rounded, ujung membulat, satu karakter dengan logo chibi).
- Isi dan angka: Plus Jakarta Sans (jernih untuk harga, kuota, tanggal).
- Alasan: kepribadian "membulat & ramah" pilihan user; angka harga dan kuota butuh sans yang mudah dibaca cepat.

## Bentuk & komponen

- Radius: kartu 16px, tombol 12px, badge 8px. Tidak ada pill di semua elemen (R-11).
- Shadow: satu tingkat elevasi saja, khusus kartu PO aktif dan panel kalkulator sebagai penanda fokus; sisanya flat (R-12).
- Ikon: hanya yang relevan dengan konten (mata uang, status), tanpa sparkle/star (R-04).
- Motif identitas: jejak paw. Dipakai sebagai bullet timeline tracking (paw terisi = status terlewati, paw kosong = belum), bullet daftar, dan ornamen footer. Satu motif, diulang, jadi tanda tangan visual.

## Dial

ENERGY 2 / RHYTHM 2 / MOTION 1

- ENERGY 2: hangat dan ramah, tetap tenang; bukan halaman marketing yang berteriak.
- RHYTHM 2: grid konsisten dengan variasi dari konten: beranda (hero + baris negara + widget kurs), halaman batch (tabel item + rincian biaya + timeline), tracking (timeline panjang). Variasi datang dari jenis konten, bukan dekorasi.
- MOTION 1: hover states dan transisi angka countdown halus saja, tanpa animasi loop. Alasan: halaman ini dibuka ulang berkali-kali oleh buyer untuk cek status; gerak berlebihan mengganggu.

## Tema

Terang saja. Alasan: identitas brand adalah cream; logo berdiri di atas putih/cream, dan dark mode akan melawan palet itu.
