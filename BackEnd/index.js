const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); // Tambah ini

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// --- UPDATE BAGIAN INI: Static Folder ---
// Ini bikin folder 'uploads' bisa diakses lewat browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.get('/', (req, res) => {
  res.send('API SadarDiri is running... 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));