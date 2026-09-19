# Project Setup

Project sederhana dengan:

* **Frontend:** React.js, TanStack Router, TanStack Query, TanStack Form, Zod, Tailwind CSS
* **Backend:** NestJS, Drizzle ORM
* **Database:** PostgreSQL
* **Database Environment:** Docker
* **Node.js:** `26.x.x`

## Requirements

Pastikan sudah terinstall:

* Node.js `26.x.x`
* npm
* Docker

Cek versi Node.js:

```bash
node -v
```

Pastikan menggunakan versi `26.x.x`.

---

## Setup

> **Ikuti langkah berikut secara berurutan.**

### 1. Jalankan Frontend

Buka terminal:

```bash
cd frontend
npm install
npm run dev
```

Biarkan terminal ini tetap berjalan.

---

### 2. Jalankan Backend

Buka **terminal baru**:

```bash
cd backend
npm install
```

Jalankan PostgreSQL menggunakan Docker:

```bash
docker compose up -d
```

Pastikan container PostgreSQL sudah berjalan:

```bash
docker ps
```

Jika PostgreSQL sudah berstatus `Up`, lanjutkan:

```bash
npm run db:migrate
```

Setelah migration berhasil, jalankan backend:

```bash
npm run start:dev
```

---

## Urutan Singkat

### Terminal 1 — Frontend

```bash
cd frontend
npm install
npm run dev
```

### Terminal 2 — Backend

```bash
cd backend
npm install
docker compose up -d
docker ps
npm run db:migrate
npm run start:dev
```

Jika sudah berjalan, silakan buka:

**http://localhost:5173**

di browser untuk melihat hasilnya.

---

## Notes

### Kalkulasi Pembayaran Bulanan

Kalkulasi pembayaran per bulan menggunakan perhitungan sederhana:

```text
Jumlah Pinjaman / Tenor
```

Hal ini dikarenakan requirement tidak mencantumkan **jumlah atau persentase bunga**, sehingga perhitungan bunga belum diterapkan.

---

### Batas Pengajuan

Setiap orang saat ini dibatasi maksimal **3 kali pengajuan**.

Pengajuan yang **diterima maupun ditolak** tetap dihitung sebagai satu pengajuan.

Hal ini merupakan interpretasi dari requirement karena tidak dijelaskan secara spesifik apakah batas 3 kali tersebut hanya berlaku untuk pengajuan yang diterima, atau seluruh pengajuan.

---

### Identifikasi Customer

Pengecekan jumlah pengajuan saat ini dilakukan berdasarkan **nama lengkap customer**.

Hal ini dilakukan karena requirement tidak menyediakan atau meminta sistem autentikasi maupun user/customer ID.

---

### Status Pengajuan

Setiap pengajuan memiliki status:

* **Pending**
* **Approved**
* **Rejected**

Pengajuan dapat diproses untuk menentukan apakah aplikasi diterima atau ditolak.
