# Panduan Deployment ke Hosting Node.js (cPanel/Hostinger)

Langkah-langkah di bawah ini adalah cara yang paling direkomendasikan dan andal untuk men-deploy aplikasi Next.js ini ke lingkungan hosting bersama (shared hosting) yang seringkali memiliki keterbatasan.

Metode utamanya adalah melakukan semua proses "berat" (instalasi dan build) di komputer lokal Anda, lalu hanya mengunggah hasilnya ke server.

---

### Langkah 1: Persiapan di Komputer Lokal

1.  **Buka Terminal:** Buka terminal atau command prompt di direktori utama proyek aplikasi Anda.

2.  **Hapus Folder Lama (Opsional tapi Direkomendasikan):**
    Untuk memastikan semuanya bersih, hapus folder `node_modules` dan `.next` jika sudah ada.
    ```bash
    rm -rf node_modules
    rm -rf .next
    ```

3.  **Instal Semua Dependensi:**
    Jalankan perintah ini untuk menginstal semua paket yang dibutuhkan oleh aplikasi.
    ```bash
    npm install
    ```

4.  **Bangun (Build) Aplikasi untuk Produksi:**
    Perintah ini akan mengompilasi dan mengoptimalkan aplikasi Anda. Ini akan membuat folder `.next` yang siap untuk produksi.
    ```bash
    npm run build
    ```

Setelah langkah ini, folder proyek Anda sekarang berisi folder `node_modules` dan `.next` yang sudah siap.

---

### Langkah 2: Unggah File ke Server Hosting

1.  **Gunakan File Manager atau FTP/SFTP:**
    Unggah **semua file dan folder** dari proyek lokal Anda ke direktori aplikasi di server hosting Anda (misalnya, di dalam folder `kontrak` atau `ARSIP` di Hostinger).

    Pastikan Anda mengunggah:
    - Folder `.next`
    - Folder `node_modules`
    - Folder `public`
    - File `package.json`
    - File `next.config.ts`
    - Dan semua file konfigurasi lainnya.

    **Penting:** Dengan mengunggah folder `node_modules`, Anda tidak perlu lagi menjalankan `npm install` di server, yang sering menjadi sumber masalah.

---

### Langkah 3: Konfigurasi di Panel Hosting (cPanel/hPanel)

1.  **Buka "Setup Node.js App":**
    Masuk ke panel kontrol hosting Anda dan navigasikan ke menu untuk mengatur aplikasi Node.js.

2.  **Pastikan Konfigurasi Benar:**
    - **Node.js version:** Pilih versi yang modern, seperti `18.x` atau `20.x`.
    - **Application mode:** Pastikan diatur ke `production`.
    - **Application root:** Arahkan ke direktori tempat Anda mengunggah file (misal, `/kontrak`).
    - **Application startup file:** Pastikan ini adalah `app.js` atau `index.js` (cPanel sering membuatnya secara otomatis, biarkan saja).

3.  **Hentikan Aplikasi (Penting):**
    Klik tombol **"Stop App"**. Ini untuk memastikan tidak ada proses lama yang berjalan.

4.  **Jalankan Aplikasi dengan Perintah yang Benar:**
    Anda tidak perlu menjalankan `npm install`. Server hanya perlu menjalankan aplikasi yang sudah di-build. Perintah untuk ini adalah `npm run start`.

    Di cPanel, Anda biasanya tidak mengetik perintah ini secara langsung. Panel kontrol akan menanganinya. Setelah mengunggah file dan mengatur konfigurasi, cukup klik tombol **"Start App"**.

    Jika ada error `Can't acquire lock`, ulangi langkah **"Stop App"**, tunggu 30 detik, lalu klik **"Start App"** lagi.

---

### Langkah 4: Otorisasi Domain di Firebase

Aplikasi ini masih perlu berbicara dengan Firebase untuk login dan database.

1.  Buka **Firebase Console** Anda.
2.  Pilih proyek Anda (`studio-7968430515-d32d0`).
3.  Pergi ke **Authentication** > tab **Settings** > **Authorized domains**.
4.  Klik **"Add domain"** dan masukkan nama domain Anda (misal: `www.domain-anda.com`).

Tanpa langkah ini, login pengguna akan gagal.
