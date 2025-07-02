import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Orders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [supplierPincode, setSupplierPincode] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://medirural.onrender.com/api/orders/supplier', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data.orders);
                setSupplierPincode(response.data.supplierPincode);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    // Group orders by status
    const groupedOrders = {
        pending: orders.filter(order => order.status === 'pending'),
        confirmed: orders.filter(order => order.status === 'confirmed'),
        shipped: orders.filter(order => order.status === 'shipped'),
        delivered: orders.filter(order => order.status === 'delivered'),
        cancelled: orders.filter(order => order.status === 'cancelled'),
        subscriptions: orders.filter(order => order.isSubscription === true)
    };

    // Get counts for each status
    const statusCounts = {
        pending: groupedOrders.pending.length,
        confirmed: groupedOrders.confirmed.length,
        shipped: groupedOrders.shipped.length,
        delivered: groupedOrders.delivered.length,
        cancelled: groupedOrders.cancelled.length,
        subscriptions: groupedOrders.subscriptions.length
    };
    
    if (loading) {
        return <div className='flex justify-center items-center min-h-[200px] text-lg font-semibold'>Loading...</div>;
    }
    if (error) {
        return <div className='flex justify-center items-center min-h-[200px] text-red-600 font-semibold'>Error: {error}</div>;
    }
    if (!orders || orders.length === 0) {
        return (
            <div className='flex flex-col justify-center items-center min-h-[200px] text-gray-600 font-semibold'>
                <p>No orders found for your area</p>
                <p className='text-sm text-gray-500 mt-2'>Pincode: {supplierPincode}</p>
            </div>
        );
    }
    
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await axios.put(`https://medirural.onrender.com/api/orders/${id}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(orders.map((order) => order._id === id ? { ...order, status: newStatus } : order));
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Status update failed');
        }
    }

    const renderStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'yellow', text: 'Pending' },
            confirmed: { color: 'blue', text: 'Confirmed' },
            shipped: { color: 'purple', text: 'Shipped' },
            delivered: { color: 'green', text: 'Delivered' },
            cancelled: { color: 'red', text: 'Cancelled' }
        };

        const config = statusConfig[status];
        const colorClasses = {
            yellow: 'text-yellow-600 bg-yellow-100',
            blue: 'text-blue-600 bg-blue-100',
            purple: 'text-purple-600 bg-purple-100',
            green: 'text-green-600 bg-green-100',
            red: 'text-red-600 bg-red-100'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[config.color]}`}>
                {config.text}
            </span>
        );
    };

    const renderOrdersTable = (ordersList, status) => {
        if (ordersList.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-medium">No {status} orders</p>
                    <p className="text-sm">Orders with {status} status will appear here</p>
                </div>
            );
        }

        // Special table for subscription orders
        if (status === 'subscriptions') {
            return (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-green-50 text-green-700">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                                <th className="py-3 px-4 text-left font-semibold">Customer Details</th>
                                <th className="py-3 px-4 text-left font-semibold">Subscription Type</th>
                                <th className="py-3 px-4 text-left font-semibold">Next Delivery Date</th>
                                <th className="py-3 px-4 text-left font-semibold">Current Status</th>
                                <th className="py-3 px-4 text-left font-semibold">Total Amount</th>
                                <th className="py-3 px-4 text-left font-semibold">Delivery Address</th>
                                <th className="py-3 px-4 text-left font-semibold">Contact Info</th>
                                <th className="py-3 px-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-green-50 transition">
                                    <td className="py-3 px-4 text-left font-medium text-sm">{order._id.slice(-8)}</td>
                                    <td className="py-3 px-4 text-left">
                                        <div>
                                            <p className="font-semibold text-green-800">{order.user?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">{order.user?.email || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">Customer ID: {order.user?._id?.slice(-6) || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-left">
                                        <div className="space-y-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Subscription
                                            </span>
                                            <div className="text-sm">
                                                <p><span className="font-medium">Duration:</span> {order.subscriptionDetails?.duration === '7days' ? '7 Days' : '1 Month'}</p>
                                                <p><span className="font-medium">Frequency:</span> {order.subscriptionDetails?.frequency === 'weekly' ? 'Weekly' : 'Monthly'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-left">
                                        {order.subscriptionDetails?.nextDeliveryDate ? (
                                            <div className="space-y-1">
                                                <span className="font-semibold text-purple-600">
                                                    {new Date(order.subscriptionDetails.nextDeliveryDate).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <div className="text-xs text-gray-500">
                                                    {(() => {
                                                        const nextDate = new Date(order.subscriptionDetails.nextDeliveryDate);
                                                        const today = new Date();
                                                        const diffTime = nextDate - today;
                                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                        if (diffDays > 0) {
                                                            return `${diffDays} days remaining`;
                                                        } else if (diffDays === 0) {
                                                            return 'Due today';
                                                        } else {
                                                            return `${Math.abs(diffDays)} days overdue`;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">N/A</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-left">
                                        {renderStatusBadge(order.status)}
                                    </td>
                                    <td className="py-3 px-4 text-left font-semibold">₹{order.totalAmount}</td>
                                    <td className="py-3 px-4 text-left">
                                        <div className="text-sm">
                                            <p className="font-medium">{order.shipping?.address || "N/A"}</p>
                                            <p className="text-gray-600">{order.shipping?.city}, {order.shipping?.state}</p>
                                            <p className="text-gray-600 font-medium">{order.shipping?.pincode}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-left">
                                        <div className="text-sm">
                                            <p className="font-medium">{order.shipping?.phone || "N/A"}</p>
                                            <p className="text-gray-600">{order.shipping?.email || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-left">
                                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <select
                                                value={order.status}
                                                onChange={e => handleUpdateStatus(order._id, e.target.value)}
                                                className="bg-white border border-green-300 text-green-700 px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // Regular table for other statuses
        return (
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                            <th className="py-3 px-4 text-left font-semibold">Customer</th>
                            <th className="py-3 px-4 text-left font-semibold">Created At</th>
                            <th className="py-3 px-4 text-left font-semibold">Status</th>
                            <th className="py-3 px-4 text-left font-semibold">Total Amount</th>
                            <th className="py-3 px-4 text-left font-semibold">Payment Method</th>
                            <th className="py-3 px-4 text-left font-semibold">Delivery Address</th>
                            <th className="py-3 px-4 text-left font-semibold">Phone No</th>
                            <th className="py-3 px-4 text-left font-semibold">Subscription</th>
                            <th className="py-3 px-4 text-left font-semibold">Next Delivery</th>
                            <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersList.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                <td className="py-3 px-4 text-left font-medium text-sm">{order._id.slice(-8)}</td>
                                <td className="py-3 px-4 text-left">
                                    <div>
                                        <p className="font-medium">{order.user?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-left text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-left">
                                    {renderStatusBadge(order.status)}
                                </td>
                                <td className="py-3 px-4 text-left font-semibold">₹{order.totalAmount}</td>
                                <td className="py-3 px-4 text-left capitalize">{order.paymentDetails?.paymentMethod || 'N/A'}</td>
                                <td className="py-3 px-4 text-left">
                                    <div className="text-sm">
                                        <p>{order.shipping?.address || "N/A"}</p>
                                        <p className="text-gray-500">{order.shipping?.city}, {order.shipping?.state}</p>
                                        <p className="text-gray-500 font-medium">{order.shipping?.pincode}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-left">{order.shipping?.phone || "N/A"}</td>
                                <td className="py-3 px-4 text-left">
                                    {order.isSubscription ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Subscription
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            One-time
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-left">
                                    {order.subscriptionDetails?.nextDeliveryDate ? (
                                        <span className="font-medium text-purple-600 text-sm">
                                            {new Date(order.subscriptionDetails.nextDeliveryDate).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 text-sm">N/A</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-left">
                                    {status !== 'delivered' && status !== 'cancelled' && (
                                        <select
                                            value={order.status}
                                            onChange={e => handleUpdateStatus(order._id, e.target.value)}
                                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Area Orders Management</h1>
                <p className="text-gray-600 mt-2">Managing orders for pincode: <span className="font-semibold text-blue-600">{supplierPincode}</span></p>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-800 font-semibold">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                        </div>
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-800 font-semibold">Confirmed</p>
                            <p className="text-2xl font-bold text-blue-600">{statusCounts.confirmed}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-800 font-semibold">Shipped</p>
                            <p className="text-2xl font-bold text-purple-600">{statusCounts.shipped}</p>
                        </div>
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V5a1 1 0 011-1h5a1 1 0 011 1v12m-1 0a2 2 0 104 0m-4 0a2 2 0 11-4 0m4 0H5a2 2 0 01-2-2V7a2 2 0 012-2h2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-800 font-semibold">Delivered</p>
                            <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
                        </div>
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m1-5a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-800 font-semibold">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
                        </div>
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-800 font-semibold">Subscriptions</p>
                            <p className="text-2xl font-bold text-emerald-600">{statusCounts.subscriptions}</p>
                        </div>
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === status
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                activeTab === status
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Orders Table for Active Tab */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">
                        {activeTab} Orders ({statusCounts[activeTab]})
                    </h2>
                </div>
                <div className="p-6">
                    {renderOrdersTable(groupedOrders[activeTab], activeTab)}
                </div>
            </div>
        </div>
    );
};

export default Orders;


        
       

    





