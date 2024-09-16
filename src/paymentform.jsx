import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();

    const order_id = `order-${Math.floor(Math.random() * 10000)}`;

    try {
      const response = await axios.post('/api/transaction', {
        order_id,
        gross_amount: amount,
        customer_name: name,
        customer_email: email,
      });

      // Redirect ke payment URL
      window.location.href = response.data.redirect_url;
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div>
      <h2>Subscribe to VCF Converter</h2>
      <form onSubmit={handlePayment}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentForm;
