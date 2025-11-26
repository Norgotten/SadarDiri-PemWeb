const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- Helper: Bikin Token JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token berlaku 30 hari
  });
};

// --- 1. REGISTER USER ---
// @desc    Daftar user baru
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Cek kelengkapan data
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tolong isi semua field' });
    }

    // Cek apakah user udah ada?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User sudah terdaftar' });
    }

    // Hash Password (Acak password biar aman)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Bikin User Baru di Database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Kirim respon sukses
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // Kasih token
      });
    } else {
      res.status(400).json({ message: 'Data user tidak valid' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. LOGIN USER ---
// @desc    Login user & dapet token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    // Cek password (Bandingkan password input vs password acak di DB)
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };