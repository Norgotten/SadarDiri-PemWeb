# 💸 SadarDiri - Financial Reality Check App

> *"Berhenti denial. Uangmu habis bukan karena tuyul, tapi karena gaya hidupmu yang nggak ngotak."*

**SadarDiri** adalah aplikasi pencatat pengeluaran (Expense Tracker) yang dirancang khusus untuk Gen-Z dan Mahasiswa. Tidak seperti aplikasi keuangan biasa yang membosankan, SadarDiri memberikan **feedback emosional** (Roasting) berdasarkan kebiasaan belanja pengguna untuk meningkatkan kesadaran finansial.

---

## 🧐 Masalah (Problem Statement)

1.  **Financial Denial:** Banyak mahasiswa takut mengecek saldo atau mencatat pengeluaran karena takut melihat kenyataan.
2.  **Aplikasi Membosankan:** Aplikasi keuangan konvensional hanya menampilkan angka kaku tanpa interaksi yang "relate" dengan pengguna.
3.  **Lupa Jejak:** Seringkali uang habis tanpa tahu kemana perginya, dan bukti struk fisik sering hilang/luntur.

## 💡 Solusi (Solution Overview)

SadarDiri hadir dengan pendekatan **Psikologis & Visual**:
* **Sistem Roasting Otomatis:** Backend akan menganalisis total pengeluaran dan memberikan status (Aman/Waspada/Bahaya) beserta pesan sarkas yang menohok.
* **Visualisasi Menarik:** Grafik Pie Chart dan Dark Mode UI yang estetik membuat proses tracking tidak terasa seperti beban.
* **Bukti Digital:** Fitur upload foto struk memastikan setiap pengeluaran memiliki bukti otentik.
* **Kalkulator Penyesalan:** Fitur inovatif yang mengonversi total pengeluaran menjadi barang receh (misal: setara 200 piring Seblak) agar pengguna lebih *aware* akan nilai uangnya.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan **MERN Stack** dengan arsitektur Modern & Modular:

### Frontend (Client)
* **React + Vite:** Performa kencang dan development cepat.
* **Tailwind CSS (v4):** Styling modern, responsif, dan sistem Dark Mode.
* **Framer Motion:** Animasi interaktif (Modal pop-up, Button bounce) untuk UX premium.
* **Chart.js:** Visualisasi data pengeluaran.
* **Axios & React Router:** Manajemen API dan Navigasi.

### Backend (Server)
* **Node.js & Express:** RESTful API yang cepat dan scalable.
* **MongoDB & Mongoose:** Database NoSQL untuk fleksibilitas data transaksi.
* **Multer:** Handling upload file (gambar struk) ke penyimpanan lokal.
* **JWT & Bcrypt:** Keamanan autentikasi (Login/Register) dan hashing password.

---

## ✨ Fitur Utama

1.  **🔐 Secure Authentication:** Register & Login dengan validasi ketat (Zod) dan enkripsi password.
2.  **📊 Dashboard "Kena Mental":** Menampilkan status keuangan, total pengeluaran, dan diagram persebaran uang.
3.  **📝 CRUD Transaksi Lengkap:** Catat, Baca, Edit, dan Hapus pengeluaran dengan mudah.
4.  **📷 Upload Bukti Struk:** Simpan foto struk belanja langsung di setiap transaksi.
5.  **🔍 Smart Filtering:** Cari transaksi berdasarkan nama atau filter berdasarkan kategori (Makanan, Transport, dll).
6.  **💡 Fitur Inovasi:** Konversi pengeluaran ke barang nyata ("Total borosmu setara 5x iPhone 13").

---

## 🚀 Cara Menjalankan Project (Setup Instructions)

Ikuti langkah ini untuk menjalankan SadarDiri di komputer lokal (Localhost).

### Prasyarat
* Node.js terinstall.
* MongoDB Community Server (Lokal) sudah berjalan.

### 1. Setup Backend
Buka terminal, masuk ke folder backend:
```
cd sadardiri-backend
```

Install dependencies:
```
npm install
```

Buat file .env di dalam folder sadardiri-backend dan isi konfigurasi berikut:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sadardiri_db
JWT_SECRET=rahasia_negara_king
```
Lalu jalankan server:
```
npm run dev
```
(Pastikan muncul pesan: "MongoDB Connected" & "Server jalan di port 5000")


### 2. Setup Frontend
Buka terminal baru, masuk ke folder frontend:
```
cd sadardiri-client
```
Install dependencies:
```
npm install
```
Jalankan aplikasi React:
```
npm run dev
```

### 3. Akses Aplikasi
Buka browser dan kunjungi: http://localhost:5173

### Screenshot Demo
