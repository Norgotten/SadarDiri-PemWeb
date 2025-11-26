const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Cek apakah di header ada token? (Format: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil tokennya aja (buang kata 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Decode token (buka segelnya)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cari user berdasarkan ID yang ada di token, simpan di req.user
      // (-password artinya password gak usah diikutin)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Lanjut ke function berikutnya (Controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, tidak ada token' });
  }
};

module.exports = { protect };