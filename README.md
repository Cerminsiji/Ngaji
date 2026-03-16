# 🌙 NGAJI DIGITAL ENGINE v2.1.0 (Ramadhan Edition)

[![GAS](https://img.shields.io/badge/Backend-Google%20Apps%20Script-emerald?style=for-the-badge&logo=google-apps-script)](https://script.google.com/)
[![Tailwind](https://img.shields.io/badge/Frontend-Tailwind%20CSS-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Version](https://img.shields.io/badge/Version-2.1.0--Ramadhan-orange?style=for-the-badge)](#)

**Ngaji Digital** adalah ekosistem aplikasi ibadah modern berbasis web yang menggabungkan estetika *glassmorphism* dengan keandalan **Google Apps Script (GAS)** sebagai *Backend-as-a-Service* (BaaS). Aplikasi ini dirancang untuk memenuhi kebutuhan spiritual digital dengan akses cepat, presisi waktu, dan antarmuka yang intuitif.

## 🔗 Live Preview
Nikmati pengalaman ibadah digital di sini:  
👉 [https://cerminsiji.github.io/Ngaji-Digital/](https://cerminsiji.github.io/Ngaji-Digital/)

---

## ✨ Fitur Unggulan Terbaru

* **📍 Smart Prayer Engine & Geolocation**: 
    * Deteksi otomatis koordinat lokasi via GPS yang disinkronkan dengan database API MyQuran v2.
    * **Auto-Timezone Sync**: Jam digital secara otomatis menyesuaikan zona waktu (**WIB, WITA, WIT**) berdasarkan lokasi kota yang dipilih melalui perhitungan *offset* UTC.
* **📖 Al-Quran Mushaf Digital**: Akses 114 Surah lengkap dengan teks Arab (Amiri Font), transliterasi Latin, dan Terjemahan Indonesia dengan sistem *Local Sync* ke Google Sheets.
* **🔍 Search Engine Hadits 9 Rawi**: Pencarian lintas 9 perawi besar (Bukhari, Muslim, Abu Daud, dll.) dengan filter kitab dinamis dan hasil yang dikelompokkan per-rawi.
* **📅 Dual-Calendar System**: 
    * Kalender Masehi bahasa Indonesia.
    * Kalender Hijriah presisi tinggi melalui integrasi **API Aladhan**.
* **📿 Tahlil & Doa Digital**: Dilengkapi dengan teks Arab, Latin, dan terjemahan Indonesia yang ditarik secara dinamis dari Google Sheets sebagai *Headless CMS*.

---

## 🛠️ Arsitektur Sistem

### 1. Backend (`Code.gs`)
Inti aplikasi yang menangani logika *serverless* dan integrasi API eksternal.
* **Routing**: Mengelola parameter `action` untuk distribusi data (getSurah, getSholat, findHadits, dll).
* **Automated Sync**: Inisialisasi otomatis struktur database di Google Sheets jika belum tersedia.
* **API Bridge**: Penghubung antara aplikasi dengan server MyQuran dan Aladhan secara aman.

### 2. Frontend (`index.html`)
Antarmuka pengguna yang ringan dan responsif:
* **Tailwind CSS**: Desain *Glassmorphism* yang elegan dan ramah mata (Dark Mode).
* **Vanilla JavaScript**: Logika aplikasi tanpa dependensi berat, memastikan performa maksimal di perangkat mobile.
* **Local Persistence**: Menyimpan preferensi kota dan zona waktu pengguna menggunakan `localStorage`.

---

## 🚀 Panduan Instalasi (Step-by-Step)

### 1. Setup Database
1.  Buat **Google Spreadsheet** baru.
2.  Buka **Extensions > Apps Script**.
3.  Salin kode dari file `Code.gs`. Pastikan sheet `DB_Surah`, `DB_Tahlil`, dan `DB_Doa` tersedia.

### 2. Deploy API
1.  Klik **Deploy > New Deployment**.
2.  Pilih **Web App**.
3.  Setel *Execute as*: **Me** dan *Who has access*: **Anyone**.
4.  Salin **Web App URL** yang muncul.

### 3. Konfigurasi Frontend
1.  Buka file `index.html`.
2.  Cari variabel `const API` (Baris 116) dan tempelkan URL Web App Anda.
3.  Simpan dan jalankan aplikasi melalui GitHub Pages atau server lokal.

---

## 📡 Endpoint API Gateway

| Action | Deskripsi |
| :--- | :--- |
| `getCalendar` | Info tanggal Masehi & Hijriah (API Aladhan). |
| `getSholat` | Jadwal bulanan & harian dengan fitur *highlighting*. |
| `getSurah` | Daftar 114 Surah Al-Quran. |
| `findHadits` | Pencarian kata kunci lintas 9 perawi besar. |
| `searchByCoords` | Deteksi nama kota berdasarkan koordinat GPS. |

---

## 📊 Roadmap 2026
- [x] Sinkronisasi Jam Digital 3 Zona Waktu Indonesia (WIB/WITA/WIT).
- [x] Perbaikan sistem highlight jadwal harian & bulanan.
- [ ] Implementasi Push Notification Adzan.
- [ ] Fitur Audio Murrotal per Ayat.

---

## 🤝 Kontribusi & Lisensi
Kami menyambut baik kontribusi untuk pengembangan fitur dakwah digital ini. 
* **Lisensi**: MIT License.
* **Atribusi Data**: MyQuran API, Aladhan API, e-Quran.id, dan Hadith-API Gadingnst.

**Versi**: 2.1.0-Ramadhan-Edition  
**Author**: [SukslanMedia]
