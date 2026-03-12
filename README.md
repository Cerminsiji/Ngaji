# 🌙 NGAJI DIGITAL (Ramadhan 2026 Edition)

**NGAJI DIGITAL** adalah aplikasi web berbasis **Google Apps Script (GAS)** yang dirancang untuk mendukung ibadah harian dan Riset Ramadhan 2026. Aplikasi ini mengintegrasikan **Jadwal Sholat real-time**, **Al-Quran Digital**, **Kumpulan Doa**, dan **Tahlil** dalam satu antarmuka yang modern, ringan, dan responsif.

### 🔗 Live Preview
Anda dapat mencoba aplikasi secara langsung melalui tautan berikut:  
👉 **[https://cerminsiji.github.io/Ngaji/](https://cerminsiji.github.io/Ngaji/)**

---

## ✨ Fitur Utama
* **Jadwal Sholat Real-time:** Berdasarkan lokasi GPS atau pemilihan kota manual di seluruh Indonesia.
* **Al-Quran Digital:** Teks Arab, Terjemahan Indonesia, dan pemutar audio Murottal per surah.
* **Database Terintegrasi:** Sinkronisasi otomatis dari API publik ke Google Spreadsheet (mengurangi beban API).
* **Dzikir & Doa:** Kumpulan doa harian dengan teks Arab dan terjemahan yang jelas.
* **Majelis Tahlil:** Panduan urutan tahlil lengkap.
* **Customizable UI:** Fitur perbesar/perkecil ukuran font Arab untuk kenyamanan membaca.
* **PWA Ready:** Tampilan *glassmorphism* yang optimal di perangkat mobile.

---

## 🛠️ Persiapan & Setup (Google Apps Script)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di akun Google Anda sendiri:

### 1. Buat Spreadsheet Baru
* Buka **[Google Sheets](https://sheets.new)**.
* Beri nama file, misalnya: `Database Ngaji Digital`.
* Biarkan kosong, skrip akan membuat sheet secara otomatis.

### 2. Masuk ke Editor Skrip
* Di Google Sheets, klik menu **Extensions** > **Apps Script**.
* Hapus semua kode yang ada di file `Code.gs` dan tempelkan kode **Backend (Code.gs)** yang telah disiapkan.

### 3. Tambahkan File HTML
* Di editor Apps Script, klik tanda plus (**+**) di samping "Files".
* Pilih **HTML**, beri nama `index` (pastikan namanya `index.html`).
* Tempelkan kode **Frontend (index.html)** ke dalam file tersebut.

### 4. Konfigurasi Link API
* Di file `index.html`, cari variabel berikut (biasanya di baris awal tag `<script>`):
  `const API = "URL_WEB_APP_ANDA";`
* Biarkan dulu, kita akan mendapatkan URL-nya setelah tahap Deployment.

### 5. Deployment
* Klik tombol **Deploy** > **New Deployment** (kanan atas).
* Pilih type: **Web App**.
* Description: `Ngaji Digital`.
* Execute as: **Me** (Email Anda).
* Who has access: **Anyone** (Penting agar API bisa diakses publik).
* Klik **Deploy** dan setujui izin akses (**Authorize Access**).
* **Salin URL Web App** yang muncul.

### 6. Finalisasi
* Tempelkan URL yang sudah disalin tadi ke variabel `const API` di dalam file `index.html`.
* Klik **Save** (ikon disket).
* Lakukan **Deploy** sekali lagi (pilih **Manage Deployments** > **Edit** > **New Version** > **Deploy**) untuk memastikan perubahan link tersimpan secara publik.

---

## 🚀 Cara Penggunaan Pertama Kali
Setelah URL Web App dibuka:
* Halaman awal akan muncul namun data mungkin masih kosong.
* Klik tombol **🔄 Sync Data** di halaman Home.
* Tunggu hingga muncul notifikasi **"Sinkronisasi Berhasil!"**.
* Data API kini telah berpindah ke Google Sheets Anda dan aplikasi siap digunakan sepenuhnya.

---

## 📚 Sumber Data (API Credits)
Kami berterima kasih kepada penyedia API publik yang memungkinkan aplikasi ini berjalan:
* **Jadwal Sholat & Kota:** [MyQuran API](https://api.myquran.com/)
* **Al-Quran & Audio:** [e-Quran.id](https://equran.id/apiv2)
* **Tahlil:** [Islamic API (Zhirrr)](https://islamic-api-zhirrr.vercel.app/)

---

## ⚠️ Disclaimer
Aplikasi ini dibuat untuk tujuan edukasi dan membantu ibadah. Pengembang tidak bertanggung jawab atas perbedaan waktu sholat yang mungkin terjadi karena keterlambatan sinkronisasi API. Selalu pastikan untuk melakukan sinkronisasi ulang secara berkala.

---
