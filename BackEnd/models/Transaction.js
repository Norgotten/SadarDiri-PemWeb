const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Relasi ke User (biar tau ini pengeluaran siapa)
  },
  title: { type: String, required: true }, // Contoh: "Kopi Starbucks"
  amount: { type: Number, required: true }, // Contoh: 60000
  category: { 
    type: String, 
    required: true, 
    enum: ['Makanan', 'Transport', 'Hiburan', 'Tagihan', 'Lainnya'] 
  },
  date: { type: Date, default: Date.now },
  imageUrl: { type: String }, // Link gambar bukti struk (dari Cloudinary nanti)
  notes: { type: String } // Opsional: Alasan khilaf
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);