const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');

// @desc    Ambil semua transaksi user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tambah transaksi baru (Versi Lokal)
const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    let imageUrl = ''; 

    // Logic Simpel Upload Lokal
    if (req.file) {
      // Kita bikin URL lengkap biar frontend tinggal pake
      // Contoh: http://localhost:5000/uploads/1748239-struk.jpg
      const protocol = req.protocol; 
      const host = req.get('host');
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    if (!title || !amount || !category) {
      return res.status(400).json({ message: 'Mohon isi judul, jumlah, dan kategori' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
      imageUrl: imageUrl, // URL lokal masuk sini
      notes
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Hapus transaksi
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User tidak punya akses' });
    }

    await transaction.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaksi (Ganti data atau Ganti gambar)
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    // 1. Cari transaksinya dulu
    let transaction = await Transaction.findById(req.params.id);

    // 2. Cek ada gak barangnya?
    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    // 3. Pastikan yang edit adalah pemilik data
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User tidak punya akses' });
    }

    // 4. Siapkan data baru dari body
    const { title, amount, category, date, notes } = req.body;
    let imageUrl = transaction.imageUrl; // Default: pake gambar lama

    // 5. LOGIC GANTI GAMBAR (Penting!)
    if (req.file) {
      // A. Hapus gambar lama dari folder uploads (Kalau ada & bukan string kosong)
      if (transaction.imageUrl) {
        // Kita harus ambil nama filenya aja dari URL
        // URL: http://localhost:5000/uploads/123-gambar.jpg
        // Filename: 123-gambar.jpg
        const oldFilename = transaction.imageUrl.split('/').pop();
        const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
        
        // Cek file fisiknya ada gak, kalau ada hapus
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // B. Set URL gambar baru
      const protocol = req.protocol; 
      const host = req.get('host');
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    // 6. Update Database
    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    transaction.notes = notes || transaction.notes;
    transaction.imageUrl = imageUrl;

    const updatedTransaction = await transaction.save();

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ambil Data Analisis & Roasting
// @route   GET /api/transactions/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    // 1. Hitung Total Pengeluaran
    const totalExpense = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    // 2. Hitung Per Kategori (Buat Chart)
    // Hasilnya bakal kayak: { Makanan: 50000, Transport: 20000 }
    const categoryBreakdown = transactions.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    // 3. THE ROASTING LOGIC (Kecerdasan Buatan... Dikit) 🤖
    // Kita asumsi limit aman mahasiswa itu 100rb/hari atau total budget tertentu.
    // ... logic hitung totalExpense di atas ...

    // KUMPULAN PESAN (Array)
    let status = 'Aman';
    let messageOptions = []; // Kita isi arraynya berdasarkan kondisi

    if (totalExpense > 1000000) {
        status = 'Bahaya';
        messageOptions = [
        'Menyala abangku! Teruslah membakar duit sampai jadi abu.',
        'Cek saldo gih, siapa tau minusnya udah nyampe inti bumi.',
        'Halo RSJ? Ada pasien halusinasi jadi orang kaya nih.'
        ];
    } else if (totalExpense > 500000) {
        status = 'Waspada';
        messageOptions = [
        'Mulai ngerem bos. Ginjal sisa satu kan?',
        'Dikit-dikit "Self Reward", lama-lama "Self Destruction".',
        'Yakin saldo masih cukup? Cek m-banking sekarang.'
        ];
    } else if (totalExpense > 100000) {
        status = 'Hati-hati';
        messageOptions = [
        'Inget, akhir bulan makan promag kalau gak dijaga.',
        'Itu duit apa air keran? Ngalir mulu perasaan.',
        'Uang keluar lancar jaya, uang masuk seret parah.'
        ];
    } else {
    // Kalau aman (< 100rb)
        messageOptions = [
        'Dompet aman, tapi hati sepi ya?',
        'Pertahankan. Irit pangkal kaya (tapi boong).',
        'Nah gitu dong, sadar diri kalau lagi kere.'
        ];
    }

    // PILIH 1 PESAN SECARA ACAK
    const randomMessage = messageOptions[Math.floor(Math.random() * messageOptions.length)];

    res.status(200).json({
    totalExpense,
    categoryBreakdown,
    status,
    message: randomMessage, // Kirim pesan acak
    lastTransactions: transactions.slice(0, 3)
    });

    res.status(200).json({
      totalExpense,
      categoryBreakdown,
      status,
      message,
      lastTransactions: transactions.slice(0, 3) // Kirim 3 transaksi terakhir buat preview
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, addTransaction, deleteTransaction, updateTransaction, getDashboardData };