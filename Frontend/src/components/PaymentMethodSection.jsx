import React from 'react';

export default function PaymentMethodSection({ payment, setPayment }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Payment Method</h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" value="cod" checked={payment === 'cash'} onChange={e => setPayment(e.target.value)} className="accent-blue-700" />
          <span>Cash on Delivery</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" value="upi" checked={payment === 'upi'} onChange={e => setPayment(e.target.value)} className="accent-blue-700" />
          <span>UPI</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" value="card" checked={payment === 'card'} onChange={e => setPayment(e.target.value)} className="accent-blue-700" />
          <span>Card</span>
        </label>
      </div>
    </div>
  );
} 