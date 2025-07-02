import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Package, 
    CheckCircle, 
    Clock, 
    TrendingUp, 
    DollarSign,
    Truck,
    AlertCircle,
    BarChart3,
    RefreshCw,
    Wifi,
    WifiOff
} from 'lucide-react';

const Stats = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        todayOrders: 0,
        thisWeekOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    
    const intervalRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Auto-refresh interval (30 seconds)
    const REFRESH_INTERVAL = 30000;

    useEffect(() => {
        fetchStats();
        
        // Set up auto-refresh
        if (isAutoRefresh) {
            startAutoRefresh();
        }

        // Cleanup on unmount
        return () => {
            stopAutoRefresh();
        };
    }, [token, isAutoRefresh]);

    const startAutoRefresh = () => {
        stopAutoRefresh(); // Clear any existing interval
        intervalRef.current = setInterval(() => {
            fetchStats(true); // Silent refresh
        }, REFRESH_INTERVAL);
    };

    const stopAutoRefresh = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const fetchStats = async (silent = false) => {
        try {
            // Cancel previous request if still pending
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            
            // Create new abort controller
            abortControllerRef.current = new AbortController();
            
            if (!silent) {
                setLoading(true);
                setIsRefreshing(true);
            }
            
            setConnectionStatus('connecting');
            
            const response = await axios.get('https://medirural.onrender.com/api/orders/supplier', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                signal: abortControllerRef.current.signal
            });
            
            // Transform orders data to stats format
            const orders = response.data?.orders || [];
            const transformedStats = transformOrdersToStats(orders);
            
            setStats(transformedStats);
            setLastUpdated(new Date());
            setConnectionStatus('connected');
            setError(null);
            
        } catch (error) {
            if (error.name === 'AbortError') {
                return; // Request was cancelled
            }
            
            console.error('Error fetching stats:', error);
            setConnectionStatus('disconnected');
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleManualRefresh = () => {
        fetchStats();
    };

    const toggleAutoRefresh = () => {
        setIsAutoRefresh(!isAutoRefresh);
    };

    // Transform orders data to stats format
    const transformOrdersToStats = (orders) => {
        if (!orders || !Array.isArray(orders)) {
            return {
                totalOrders: 0,
                pendingOrders: 0,
                deliveredOrders: 0,
                confirmedOrders: 0,
                shippedOrders: 0,
                cancelledOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                todayOrders: 0,
                thisWeekOrders: 0
            };
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        let totalRevenue = 0;
        let todayOrders = 0;
        let thisWeekOrders = 0;
        const statusCounts = {
            pending: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const orderAmount = order.totalAmount || 0;
            
            totalRevenue += orderAmount;
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

            // Check if order is from today
            if (orderDate >= today) {
                todayOrders++;
            }

            // Check if order is from this week
            if (orderDate >= weekAgo) {
                thisWeekOrders++;
            }
        });

        return {
            totalOrders: orders.length,
            pendingOrders: statusCounts.pending || 0,
            deliveredOrders: statusCounts.delivered || 0,
            confirmedOrders: statusCounts.confirmed || 0,
            shippedOrders: statusCounts.shipped || 0,
            cancelledOrders: statusCounts.cancelled || 0,
            totalRevenue,
            averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
            todayOrders,
            thisWeekOrders
        };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatLastUpdated = (date) => {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (seconds < 60) {
            return `${seconds}s ago`;
        } else if (minutes < 60) {
            return `${minutes}m ago`;
        } else {
            return date.toLocaleTimeString();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'shipped': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'confirmed': return <CheckCircle className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <AlertCircle className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px] text-red-600">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Error loading stats</p>
                    <p className="text-sm text-gray-600">{error}</p>
                    <button 
                        onClick={handleManualRefresh}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with Real-time Controls */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-700 mb-2">Dashboard Statistics</h1>
                        <p className="text-gray-600">Overview of your area-based order performance</p>
                    </div>
                    
                    {/* Real-time Controls */}
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        {/* Connection Status */}
                        <div className="flex items-center space-x-2">
                            {connectionStatus === 'connected' ? (
                                <Wifi className="w-4 h-4 text-green-600" />
                            ) : connectionStatus === 'connecting' ? (
                                <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />
                            ) : (
                                <WifiOff className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                                connectionStatus === 'connected' ? 'text-green-600' :
                                connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                                {connectionStatus === 'connected' ? 'Live' :
                                 connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
                            </span>
                        </div>

                        {/* Auto-refresh Toggle */}
                        <button
                            onClick={toggleAutoRefresh}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                                isAutoRefresh 
                                    ? 'bg-green-100 text-green-700 border border-green-300' 
                                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}
                        >
                            {isAutoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                        </button>

                        {/* Manual Refresh */}
                        <button
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-300 hover:bg-blue-200 transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>

                        {/* Last Updated */}
                        <div className="text-sm text-gray-500">
                            Updated: {formatLastUpdated(lastUpdated)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                    {isRefreshing && (
                        <div className="absolute top-2 right-2">
                            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">All time orders in your area</p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                    {isRefreshing && (
                        <div className="absolute top-2 right-2">
                            <RefreshCw className="w-4 h-4 text-green-600 animate-spin" />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Revenue from all orders</p>
                    </div>
                </div>

                {/* Average Order Value */}
                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                    {isRefreshing && (
                        <div className="absolute top-2 right-2">
                            <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Average per order</p>
                    </div>
                </div>

                {/* Today's Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                    {isRefreshing && (
                        <div className="absolute top-2 right-2">
                            <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Orders received today</p>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Status Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Breakdown</h3>
                    <div className="space-y-4">
                        {[
                            { status: 'pending', count: stats.pendingOrders, label: 'Pending Orders' },
                            { status: 'confirmed', count: stats.confirmedOrders, label: 'Confirmed Orders' },
                            { status: 'shipped', count: stats.shippedOrders, label: 'Shipped Orders' },
                            { status: 'delivered', count: stats.deliveredOrders, label: 'Delivered Orders' },
                            { status: 'cancelled', count: stats.cancelledOrders, label: 'Cancelled Orders' }
                        ].map((item) => (
                            <div key={item.status} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${getStatusColor(item.status).split(' ')[1]}`}>
                                        {getStatusIcon(item.status)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">{item.count}</p>
                                    <p className="text-sm text-gray-500">
                                        {stats.totalOrders > 0 ? ((item.count / stats.totalOrders) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Statistics</h3>
                    <div className="space-y-6">
                        {/* Delivery Rate */}
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Delivery Rate</p>
                            <p className="text-3xl font-bold text-green-700">
                                {stats.totalOrders > 0 ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-sm text-green-600">{stats.deliveredOrders} of {stats.totalOrders} orders delivered</p>
                        </div>

                        {/* This Week's Performance */}
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">This Week</p>
                            <p className="text-3xl font-bold text-blue-700">{stats.thisWeekOrders}</p>
                            <p className="text-sm text-blue-600">Orders this week</p>
                        </div>

                        {/* Pending vs Delivered */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm font-medium text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-600">Delivered</p>
                                <p className="text-2xl font-bold text-green-700">{stats.deliveredOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {stats.totalOrders > 0 ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats; 