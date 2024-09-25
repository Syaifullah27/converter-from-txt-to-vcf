/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Midtrans
let snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true saat di production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

app.post('/api/subscribe', async (req, res) => {
  const { userId, email, amount } = req.body;

  // Ambil 5 angka pertama dari userId
  const shortUserId = userId.substring(0, 5);

  const parameter = {
    transaction_details: {
      order_id: `order-${shortUserId}-${Date.now()}`,
      gross_amount: amount,
    },
    customer_details: {
      email: email, // Gunakan email yang dikirim dari front-end
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.json({ token: transaction.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
