import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartReviewSection() {
  const { items, getCartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Cart Review</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="mb-4 divide-y divide-gray-200">
          {items.map(item => (
            <li key={item.medicine._id} className="py-2 flex justify-between items-center">
              <span className="font-medium text-gray-800">{item.medicine.name}</span>
              <span className="text-gray-500">x{item.quantity}</span>
              <span className="font-semibold text-blue-700">₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg">Total:</span>
        <span className="font-bold text-blue-700 text-lg">₹{getCartTotal()}</span>
      </div>
      <button
        onClick={() => navigate('/cart')}
        className="px-4 py-2 rounded-lg border border-blue-700 text-blue-700 bg-white font-semibold transition hover:bg-blue-50"
      >
        Edit Cart
      </button>
    </div>
  );
} 