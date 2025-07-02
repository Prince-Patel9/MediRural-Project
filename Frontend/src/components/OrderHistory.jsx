import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Package, XCircle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const statusColors = {
  pending: 'bg-orange-100 text-orange-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-orange-500" />,
  confirmed: <CheckCircle className="w-4 h-4 text-blue-500" />,
  shipped: <Package className="w-4 h-4 text-purple-500" />,
  delivered: <CheckCircle className="w-4 h-4 text-green-500" />,
  cancelled: <XCircle className="w-4 h-4 text-red-500" />,
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

const OrderHistory = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://medirural.onrender.com/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (user && token) fetchOrders();
  }, [user, token]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.put(`https://medirural.onrender.com/api/orders/${orderId}`, { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold">Loading your orders...</div>;
  }

  if (!orders.length) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
      <Package className="w-12 h-12 mb-4" />
      <div>No orders found.</div>
    </div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                  {statusIcons[order.status]}
                </div>
                <div className="text-sm text-gray-500">Order #{order._id.slice(-8)} • {formatDate(order.createdAt)}</div>
                <div className="font-semibold text-lg mt-1">{formatCurrency(order.totalAmount)}</div>
              </div>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setExpanded(e => ({ ...e, [order._id]: !e[order._id] }))}
                aria-label="Expand order details"
              >
                {expanded[order._id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {expanded[order._id] && (
              <div className="mt-4 border-t pt-4 space-y-3">
                <div>
                  <div className="font-semibold mb-2">Items:</div>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.medicine.name}</div>
                          <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold">{formatCurrency(item.price)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-1">Shipping Address:</div>
                  <div className="text-sm text-gray-700">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.pincode}
                  </div>
                </div>
                {order.status === 'pending' || order.status === 'confirmed' ? (
                  <button
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel Order
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory; 