const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 5000;

const MIDTRANS_SERVER_KEY = 'SB-Mid-server-AVXq0TFmxFzN4Ep5_YN7gNzt';

app.use(bodyParser.json());

// Serve the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Route untuk memproses pembayaran
app.post('/api/transaction', async (req, res) => {
  const { order_id, gross_amount, customer_name, customer_email } = req.body;

  const transactionData = {
    transaction_details: {
      order_id,
      gross_amount,
    },
    customer_details: {
      first_name: customer_name,
      email: customer_email,
    },
    credit_card: {
      secure: true,
    },
  };

  try {
    const response = await axios.post(
      'https://api.sandbox.midtrans.com/v2/charge',
      transactionData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY).toString('base64')}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});