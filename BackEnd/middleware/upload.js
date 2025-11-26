const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan lokal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Simpan di folder 'uploads'
  },
  filename: function (req, file, cb) {
    // Namain file unik: timestamp-namaasli.jpg
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

// Filter file (Cuma boleh Gambar)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Cuma boleh JPG/PNG.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimal 5MB
  fileFilter: fileFilter
});

module.exports = upload;