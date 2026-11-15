# DESIGN.md: PawFox GO

Arah desain resmi PawFox GO ("Collector's Parcel & Holo-Editorial"), menggantikan arah oranye-cream lama per redesign November 2026. Filter antislop berlaku di atas arah ini.

## Identitas

- Nama tampilan: PawFox GO (senada akun X @pawfoxgo).
- Produk: group order K-pop personal, satu organizer, barang dari Thailand, Korea Selatan, China, dan Jepang, plus split lokal Indonesia.
- Kontak: X @pawfoxgo, email pawfox0512@gmail.com.
- Logo: puppy + fox chibi di lingkaran paw (`public/logo.png`, latar putih solid). Dipakai di atas permukaan cream dengan `mix-blend-mode: multiply`. Di atas permukaan gelap, logo selalu duduk di dalam cakram cream (emblem), tidak pernah langsung di atas espresso.

## Kepribadian

- Editorial yang berani tapi tetap hangat: bentuk kertas, tiket, dan label kiriman yang biasa dipegang kolektor.
- Bahasa Indonesia kasual dan sopan ("jajan", "tanpa drama"). Istilah GO (PO, slot, rate, batch) dipakai apa adanya.
- Tidak ada klaim yang tidak bisa dibuktikan: tidak ada "verified", "real-time", angka statistik, atau testimoni karangan.

## Palet

Inti (dipakai apa adanya untuk isian dan teks besar):

- Cream kertas `#FAF6F0`: kanvas halaman.
- Sand `#F1EAE0`: permukaan sekunder (stub tiket, chip, kepala tabel).
- Espresso `#181412`: semua teks utama, blok gelap (footer, alur paket) dengan teks `#FAF6F0`.
- Terracotta fox `#E85D3F`: aksen utama. Tombol utama, garis rute aktif, penanda urgensi.
- Lilac holo `#7C6FF6`: aksen kolektor. Tag batch, kilau holo, status "Arrived admin".
- Emerald `#1F8A5B`: khusus stempel OPEN.

Netral tambahan: kertas tiket `#FFFDF8` (kartu di atas kanvas cream).

Tinta teks kecil (lolos WCAG AA 4.5:1 di cream dan sand, dicek dengan contrast-check):

- Terracotta tinta `#B23C20` (5.48:1 di cream, 4.94:1 di sand).
- Lilac tinta `#5446D1` (6.15:1 di cream).
- Emerald tinta `#176E48` (5.80:1 di cream).

Aturan: tombol terracotta selalu berteks espresso (5.29:1). Putih di atas terracotta (3.46:1) tidak dipakai. Warna inti hanya jadi teks kalau ukurannya besar (18px tebal ke atas).

Alasan: kanvas kertas + espresso memberi kontras tinggi ala editorial; terracotta datang dari warna fox di logo; lilac mewakili kilau holo photocard, benda yang memang dikoleksi buyer.

## Tipografi

- Plus Jakarta Sans 500/600/700/800: judul (`letter-spacing: -0.025em`, `line-height: 1.12`) dan isi. Alasan: huruf Indonesia yang tegas di bobot 800, tetap jernih untuk paragraf.
- JetBrains Mono 400/500/600: kode bandara (BKK, ICN, PVG, NRT, CGK), rate, rasio slot (20/40), tanggal tutup, kode order. Alasan: angka tabular sejajar dan rasa label kiriman. Mono tidak pernah dipakai untuk judul besar.

## Bentuk & komponen

- Motif identitas: tiket/air waybill. Kartu batch berbentuk boarding pass dengan takik dan garis sobek, stub kanan berisi slot, rate, dan tombol. Kode rute mono di hero dan detail batch.
- Pooling photocard: tag per member A2O SOUL (lilac) di tiket dan detail batch, dari item `POB Photocard · <Nama>`.
- Paw dari logo tetap hidup sebagai bullet timeline tracking (paw terisi = status terlewati).
- Radius: tiket dan panel 14px, tombol 10px, chip filter 10px, badge 6px, stempel 4px. Pill hanya untuk navbar mengambang dan CTA di dalamnya.
- Tepi kartu: `1px solid #E5DDD0`, tanpa bayangan, tanpa border bertumpuk atau garis putus-putus di dalam kartu. Satu-satunya garis putus-putus adalah sobekan tiket (motif). Kotak input tetap memakai tepi lebih gelap (~4:1) supaya kelihatan sebagai isian.
- Bayangan: hanya untuk yang mengambang (kartu hero, navbar, menu seluler, modal).
- Ruang: jarak antarseksi dibuat lega (beranda 96-112px di desktop), label kecil yang mengulang informasi dibuang.
- Status: stempel Open hanya untuk batch yang tanggal tutupnya belum lewat. Batch Open yang lewat tenggat tampil "Closed" sampai admin memindahkan statusnya.
- Glass: hanya navbar (satu elemen), karena konten lewat di bawahnya saat scroll.
- Holo: gradien conic lilac-terracotta hanya di cincin emblem hero dan pojok kartu review. Alasan: meniru foil holo photocard.
- Ikon: set SVG buatan sendiri dengan garis tebal 2.25 senada outline logo (pesawat, warehouse, kotak, rumah, menu, tutup, bintang, tautan luar). Tanpa Lucide.
- Bendera: SVG inline (emoji bendera tidak tampil di Windows).

## Dial

ENERGY 3 / RHYTHM 3 / MOTION 2

- ENERGY 3: hero berani dengan kartu waybill interaktif dan blok espresso kontras.
- RHYTHM 3: tiap seksi beranda punya komposisi sendiri: hero dua kolom, tumpukan tiket, blok gelap alur paket, slip hitung, dinding review.
- MOTION 2 di beranda: tilt kartu hero (pointer halus saja), busur rute digambar sekali saat negara dipilih dengan satu titik berjalan ke CGK, transisi filter batch, garis progres alur paket. Tidak ada animasi loop tanpa pemicu.
- Halaman yang sering dibuka ulang (`/tracking`, `/po/[slug]`) tetap di level hover dan transisi saja, karena buyer datang ke sana untuk cek status, bukan untuk ditonton.
- Semua gerak mati di `prefers-reduced-motion: reduce`.

## Tema

Terang saja, dengan blok gelap espresso sebagai kontras seksi. Alasan: identitas brand adalah kertas cream, dan logo berlatar putih butuh permukaan terang.
