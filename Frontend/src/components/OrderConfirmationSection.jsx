import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirmationSection({ orderId }) {
  const navigate = useNavigate();
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-2 text-green-700">Order Placed!</h2>
      <p className="mb-2 text-lg">Your order ID: <b className="text-blue-700">{orderId}</b></p>
      <p className="mb-6 text-gray-700">Thank you for your purchase.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold transition hover:bg-blue-800"
      >
        Continue Shopping
      </button>
    </div>
  );
} 