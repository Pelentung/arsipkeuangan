# Panduan Deployment

Ada dua metode utama untuk men-deploy aplikasi ini. Pilih salah satu yang paling sesuai untuk Anda.

---

## Metode 1: Deployment Otomatis dari GitHub (Sangat Direkomendasikan)

Ini adalah cara modern, paling mudah, dan paling andal untuk men-deploy aplikasi Next.js. Anda menghubungkan repositori GitHub Anda ke layanan hosting, dan setiap kali Anda melakukan `git push`, aplikasi akan otomatis di-build dan di-deploy.

**Platform yang Direkomendasikan:**
*   **Firebase App Hosting**: Pilihan yang sangat baik karena sudah terintegrasi dengan Firebase.
*   **Vercel**: Dibuat oleh pengembang Next.js, sangat cepat dan mudah digunakan.

### Langkah-langkah Umum (Contoh Menggunakan Vercel/Firebase App Hosting):

1.  **Push Kode ke GitHub:** Pastikan semua kode terbaru Anda sudah ada di repositori GitHub (`ropstory`).

2.  **Daftar ke Platform Hosting:**
    *   Buka [Vercel](://pscovercel.htmt) atau [Firebase Console](https://console.firebase.google.com/).
    *   Daftar atau login menggunakan akun GitHub Anda.

3.  **Impor Proyek Anda:**
    *   Cari opsi seperti "Add New Project" atau "Import Project".
    *   Pilih repositori GitHub `ropstory` dari daftar yang muncul.

4.  **Konfigurasi Proyek:**
    *   Platform akan otomatis mendeteksi bahwa ini adalah proyek Next.js. Anda biasanya tidak perlu mengubah pengaturan build apa pun.

5.  **Tambahkan Environment Variables (PENTING!):**
    *   Cari bagian "Environment Variables" di pengaturan proyek.
    *   Anda harus menambahkan semua kunci Firebase Anda di sini. Ini menjaga agar kunci Anda tetap aman. Tambahkan satu per satu:
        *   `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIza...` (Salin dari file config lama Anda)
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `studio... .firebaseapp.com`
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `studio-7968430515-d32d0`
        *   `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:929...`
        *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `929...`
        *   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = (jika ada)

6.  **Deploy:**
    *   Klik tombol "Deploy".
    *   Platform akan menarik kode Anda dari GitHub, melakukan `npm install` dan `npm run build`, lalu men-deploy aplikasi Anda. Anda akan mendapatkan URL publik setelah selesai.

7.  **Otorisasi Domain di Firebase:**
    *   Buka **Firebase Console** > **Authentication** > **Settings** > **Authorized domains**.
    *   Klik **"Add domain"** dan masukkan domain yang diberikan oleh Vercel/Firebase App Hosting (misalnya, `ropstory.vercel.app`).

---

## Metode 2: Deployment Manual ke Hosting Node.js (cPanel/Hostinger)

Gunakan metode ini jika Anda tidak bisa menggunakan platform otomatis. Metode utamanya adalah melakukan semua proses "berat" di komputer lokal, lalu hanya mengunggah hasilnya ke server.

### Langkah 1: Persiapan di Komputer Lokal

1.  **Buka Terminal:** Buka terminal di direktori utama proyek.
2.  **Hapus Folder Lama (Opsional):** `rm -rf node_modules .next`
3.  **Instal Dependensi:** `npm install`
4.  **Bangun Aplikasi:** `npm run build`

### Langkah 2: Unggah File ke Server Hosting

1.  Unggah **semua file dan folder** dari proyek lokal Anda ke direktori aplikasi di server hosting (`/kontrak` atau `/ARSIP`). Pastikan Anda mengunggah folder `.next` dan `node_modules`.

### Langkah 3: Konfigurasi di Panel Hosting (cPanel/hPanel)

1.  Buka **"Setup Node.js App"**.
2.  Pastikan konfigurasi benar:
    *   **Node.js version:** `18.x` atau `20.x`.
    *   **Application mode:** `production`.
    *   **Application root:** Arahkan ke direktori Anda.
    *   **Application startup file:** `server.js` atau `app.js` (biasanya dibuat otomatis).
3.  **Hentikan Aplikasi:** Klik **"Stop App"**, tunggu 30 detik.
4.  **Jalankan Aplikasi:** Klik **"Start App"**. Panel akan otomatis menjalankan `npm run start` untuk Anda.

### Langkah 4: Otorisasi Domain di Firebase

1.  Buka **Firebase Console** > **Authentication** > **Settings** > **Authorized domains**.
2.  Klik **"Add domain"** dan masukkan nama domain hosting Anda (misal: `www.domain-anda.com`).
