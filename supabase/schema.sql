-- Skema database PawFox GO (Fase 2)
-- Aman dijalankan berkali-kali: tabel yang sudah ada akan dilewati,
-- yang belum ada akan dibuat.
--
-- MAU MULAI BERSIH DARI NOL? Jalankan dulu "BLOK RESET" di bagian paling
-- bawah file ini (hapus tanda --), lalu jalankan seluruh file.

-- Profil buyer yang login lewat LINE
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  line_user_id text unique not null,
  display_name text not null,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Negara dan komponen
create table if not exists countries (
  kode text primary key,
  nama text not null,
  mata_uang text not null,
  urutan int not null default 0
);

create table if not exists components (
  id text primary key,
  country_kode text references countries(kode),
  nama text not null,
  deskripsi text,
  urutan int not null default 0
);

-- Batch PO
create table if not exists batches (
  id text primary key,
  component_id text references components(id),
  nama text not null,
  slug text unique not null,
  buka_po date not null,
  tutup_po date not null,
  kurs_go numeric not null,
  ongkir_lokal int not null default 0,
  ongkir_internasional int not null default 0,
  fee_organizer int not null default 0,
  status text not null default 'po_dibuka',
  catatan text
);

create table if not exists batch_items (
  id text primary key,
  batch_id text references batches(id),
  nama text not null,
  harga_lokal numeric not null,
  kuota int not null default 0,
  terisi int not null default 0,
  urutan int not null default 0
);

create table if not exists tracking_updates (
  id bigint generated always as identity primary key,
  batch_id text references batches(id),
  status text not null,
  catatan text,
  tanggal date not null
);

-- Pesanan / tagihan. Buyer bisa dari LINE (profile_id terisi)
-- atau tanpa login (buyer_username + wa_last4, untuk halaman Cek Pesanan).
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  profile_id uuid references profiles(id),
  buyer_username text,
  wa_last4 text,
  batch_id text references batches(id),
  status text not null default 'menunggu_bayar',
  total_rp int not null default 0,
  catatan text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid references orders(id),
  item_id text references batch_items(id),
  qty int not null default 1,
  harga_satuan_rp int not null
);

create table if not exists payments (
  id bigint generated always as identity primary key,
  order_id uuid references orders(id),
  bukti_url text,
  status_verifikasi text not null default 'menunggu',
  verified_at timestamptz,
  catatan_admin text
);

create table if not exists reviews (
  id bigint generated always as identity primary key,
  batch_id text references batches(id),
  profile_id uuid references profiles(id),
  nama text not null,
  bintang int not null check (bintang between 1 and 5),
  teks text not null,
  tanggal date not null default current_date,
  tampil boolean not null default false
);

create index if not exists orders_profile_idx on orders(profile_id);
create index if not exists orders_kode_idx on orders(kode);
create index if not exists tracking_batch_idx on tracking_updates(batch_id);
create index if not exists review_batch_idx on reviews(batch_id);

-- ================== BLOK RESET (opsional) ==================
-- Hapus tanda -- di awal setiap baris di bawah ini HANYA kalau kamu mau
-- menghapus semua tabel dan mulai ulang dari nol (data lama hilang).
-- Setelah dijalankan, jalankan ulang seluruh file ini.
--
-- drop table if exists reviews cascade;
-- drop table if exists payments cascade;
-- drop table if exists order_items cascade;
-- drop table if exists orders cascade;
-- drop table if exists tracking_updates cascade;
-- drop table if exists batch_items cascade;
-- drop table if exists batches cascade;
-- drop table if exists components cascade;
-- drop table if exists countries cascade;
-- drop table if exists profiles cascade;
