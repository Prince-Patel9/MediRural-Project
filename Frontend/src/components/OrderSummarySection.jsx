import React from 'react';
import { useCart } from '../context/CartContext';

export default function OrderSummarySection({ shipping, payment }) {
  const { getCartTotal, subscriptionDetails } = useCart();

  // Function to calculate next delivery date
  const calculateNextDeliveryDate = (duration) => {
    const nextDate = new Date();
    if (duration === '7days') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else if (duration === '1month') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div><span className="font-semibold">Name:</span> {shipping.name}</div>
        <div><span className="font-semibold">Address:</span> {shipping.address}, {shipping.city}, {shipping.state}, {shipping.pincode}, {shipping.country}</div>
        <div><span className="font-semibold">Phone:</span> {shipping.phone}</div>
        <div><span className="font-semibold">Email:</span> {shipping.email}</div>
        <div><span className="font-semibold">Payment:</span> {payment.toUpperCase()}</div>
        {subscriptionDetails && subscriptionDetails.isSubscription && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">📦 Subscription Order</div>
            <div><span className="font-semibold">Duration:</span> {subscriptionDetails.duration === '7days' ? '7 Days' : '1 Month'}</div>
            <div><span className="font-semibold">Frequency:</span> {subscriptionDetails.frequency === 'weekly' ? 'Weekly' : 'Monthly'} deliveries</div>
            <div><span className="font-semibold">Next Delivery:</span> {calculateNextDeliveryDate(subscriptionDetails.duration)}</div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center border-t pt-3 mt-3">
        <span className="font-semibold text-lg">Total:</span>
        <span className="font-bold text-blue-700 text-lg">₹{getCartTotal()}</span>
      </div>
    </div>
  );
} 