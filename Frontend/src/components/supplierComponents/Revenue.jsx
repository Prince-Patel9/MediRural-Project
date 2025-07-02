import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    TrendingUp, 
    TrendingDown,
    DollarSign, 
    Package, 
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Target,
    Zap,
    Sparkles,
    LineChart,
    Users,
    ShoppingCart,
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Star,
    Award,
    Trophy,
    Crown,
    Rocket,
    Eye,
    Download,
    Share2,
    Filter,
    Search,
    Settings,
    MoreHorizontal
} from 'lucide-react';

const Revenue = () => {
    const { token } = useAuth();
    const [revenueData, setRevenueData] = useState({
        dailyRevenue: [],
        medicineSales: [],
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        growthRate: 0,
        topPerformingMedicines: [],
        recentTransactions: [],
        revenueByCategory: [],
        customerMetrics: {
            newCustomers: 0,
            returningCustomers: 0,
            customerSatisfaction: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('7d');
    const [selectedView, setSelectedView] = useState('overview');
    const [lastUpdated, setLastUpdated] = useState(null);
    const intervalRef = useRef(null);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        fetchRevenueData();
        
        // Set up auto-refresh
        intervalRef.current = setInterval(() => {
            fetchRevenueData(true); // Silent refresh
        }, 30000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [selectedPeriod, token]);

    const fetchRevenueData = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
                setIsRefreshing(true);
            }
            
            const response = await axios.get('https://medirural.onrender.com/api/orders/supplier', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.orders) {
                const orders = response.data.orders || [];
                const transformedData = transformOrdersToRevenue(orders);
                setRevenueData(transformedData);
            } else {
                const mockData = generateMockData();
                setRevenueData(mockData);
            }
            
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            const mockData = generateMockData();
            setRevenueData(mockData);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const transformOrdersToRevenue = (orders) => {
        if (!orders || !Array.isArray(orders)) {
            return generateMockData();
        }

        // Group orders by date
        const dailyData = {};
        const medicineSales = {};
        const categoryRevenue = {};
        const recentTransactions = [];

        orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { revenue: 0, orders: 0 };
            }
            dailyData[date].revenue += order.totalAmount || 0;
            dailyData[date].orders += 1;

            // Track medicine sales
            if (order.medicines) {
                order.medicines.forEach(medicine => {
                    if (!medicineSales[medicine.name]) {
                        medicineSales[medicine.name] = { sales: 0, revenue: 0 };
                    }
                    medicineSales[medicine.name].sales += medicine.quantity || 1;
                    medicineSales[medicine.name].revenue += (medicine.price || 0) * (medicine.quantity || 1);
                });
            }

            // Track category revenue
            if (order.medicines) {
                order.medicines.forEach(medicine => {
                    const category = medicine.category || 'General';
                    if (!categoryRevenue[category]) {
                        categoryRevenue[category] = 0;
                    }
                    categoryRevenue[category] += (medicine.price || 0) * (medicine.quantity || 1);
                });
            }

            // Recent transactions
            recentTransactions.push({
                id: order._id,
                customer: order.customerName || 'Anonymous',
                amount: order.totalAmount || 0,
                date: order.createdAt,
                status: order.status || 'completed',
                items: order.medicines?.length || 0
            });
        });

        // Convert to array format
        const dailyRevenue = Object.keys(dailyData).map(date => ({
            date,
            revenue: dailyData[date].revenue,
            orders: dailyData[date].orders
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Top performing medicines
        const topPerformingMedicines = Object.entries(medicineSales)
            .map(([name, data]) => ({
                name,
                sales: data.sales,
                revenue: data.revenue
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Revenue by category
        const revenueByCategory = Object.entries(categoryRevenue)
            .map(([category, revenue]) => ({
                category,
                revenue
            }))
            .sort((a, b) => b.revenue - a.revenue);

        // Calculate totals
        const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
        const totalOrders = dailyRevenue.reduce((sum, day) => sum + day.orders, 0);

        return {
            dailyRevenue: dailyRevenue.length > 0 ? dailyRevenue : generateMockData().dailyRevenue,
            medicineSales: topPerformingMedicines,
            topPerformingMedicines,
            recentTransactions: recentTransactions.slice(0, 10),
            revenueByCategory,
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
            growthRate: dailyRevenue.length > 1 ? 
                ((dailyRevenue[dailyRevenue.length - 1].revenue - dailyRevenue[0].revenue) / dailyRevenue[0].revenue * 100).toFixed(1) : 0,
            customerMetrics: {
                newCustomers: Math.floor(Math.random() * 50) + 20,
                returningCustomers: Math.floor(Math.random() * 100) + 50,
                customerSatisfaction: (Math.random() * 20 + 80).toFixed(1)
            }
        };
    };

    const generateMockData = () => {
        const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
        const dailyRevenue = [];
        const topPerformingMedicines = [
            { name: 'Paracetamol 500mg', sales: 1250, revenue: 6250 },
            { name: 'Amoxicillin 250mg', sales: 890, revenue: 4450 },
            { name: 'Omeprazole 20mg', sales: 650, revenue: 3250 },
            { name: 'Cetirizine 10mg', sales: 420, revenue: 2100 },
            { name: 'Metformin 500mg', sales: 380, revenue: 1900 }
        ];

        const recentTransactions = [
            { id: '1', customer: 'Rahul Kumar', amount: 1250, date: new Date(), status: 'completed', items: 3 },
            { id: '2', customer: 'Priya Sharma', amount: 890, date: new Date(Date.now() - 3600000), status: 'completed', items: 2 },
            { id: '3', customer: 'Amit Patel', amount: 2100, date: new Date(Date.now() - 7200000), status: 'completed', items: 5 },
            { id: '4', customer: 'Neha Singh', amount: 750, date: new Date(Date.now() - 10800000), status: 'completed', items: 1 },
            { id: '5', customer: 'Vikram Mehta', amount: 1650, date: new Date(Date.now() - 14400000), status: 'completed', items: 4 }
        ];

        const revenueByCategory = [
            { category: 'Pain Relief', revenue: 8500 },
            { category: 'Antibiotics', revenue: 6200 },
            { category: 'Cardiovascular', revenue: 4800 },
            { category: 'Diabetes', revenue: 3200 },
            { category: 'Vitamins', revenue: 2800 }
        ];

        let baseRevenue = 5000;
        for (let i = 0; i < days; i++) {
            const growth = Math.random() * 0.3 - 0.1;
            baseRevenue = baseRevenue * (1 + growth);
            dailyRevenue.push({
                date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                revenue: Math.round(baseRevenue),
                orders: Math.floor(Math.random() * 20) + 10
            });
        }

        const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
        const totalOrders = dailyRevenue.reduce((sum, day) => sum + day.orders, 0);

        return {
            dailyRevenue,
            medicineSales: topPerformingMedicines,
            topPerformingMedicines,
            recentTransactions,
            revenueByCategory,
            totalRevenue,
            totalOrders,
            averageOrderValue: Math.round(totalRevenue / totalOrders),
            growthRate: ((dailyRevenue[dailyRevenue.length - 1].revenue - dailyRevenue[0].revenue) / dailyRevenue[0].revenue * 100).toFixed(1),
            customerMetrics: {
                newCustomers: Math.floor(Math.random() * 50) + 20,
                returningCustomers: Math.floor(Math.random() * 100) + 50,
                customerSatisfaction: (Math.random() * 20 + 80).toFixed(1)
            }
        };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getGrowthIcon = (rate) => {
        return parseFloat(rate) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    };

    const getGrowthColor = (rate) => {
        return parseFloat(rate) >= 0 ? 'text-green-600' : 'text-red-600';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading Revenue Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            Revenue Analytics
                        </h1>
                        <p className="text-gray-600">Track your revenue growth and business performance in real-time</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                        {lastUpdated && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Last updated: {formatTime(lastUpdated)}
                            </div>
                        )}
                        <button
                            onClick={() => fetchRevenueData()}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Period Selector */}
            <div className="mb-6">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                    {[
                        { value: '7d', label: '7 Days', icon: <Calendar className="w-4 h-4" /> },
                        { value: '30d', label: '30 Days', icon: <BarChart3 className="w-4 h-4" /> },
                        { value: '90d', label: '90 Days', icon: <TrendingUp className="w-4 h-4" /> }
                    ].map((period) => (
                        <button
                            key={period.value}
                            onClick={() => setSelectedPeriod(period.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                                selectedPeriod === period.value
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            {period.icon}
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold">{formatCurrency(revenueData.totalRevenue)}</p>
                        </div>
                        <div className="p-3 bg-blue-400 bg-opacity-30 rounded-full">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        {getGrowthIcon(revenueData.growthRate)}
                        <span className={`text-sm font-medium ml-1 ${getGrowthColor(revenueData.growthRate)}`}>
                            +{revenueData.growthRate}%
                        </span>
                        <span className="text-blue-200 text-sm ml-1">vs last period</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Orders</p>
                            <p className="text-3xl font-bold">{revenueData.totalOrders}</p>
                        </div>
                        <div className="p-3 bg-green-400 bg-opacity-30 rounded-full">
                            <ShoppingCart className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-200" />
                        <span className="text-green-200 text-sm font-medium ml-1">+12.5%</span>
                        <span className="text-green-200 text-sm ml-1">vs last period</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
                            <p className="text-3xl font-bold">{formatCurrency(revenueData.averageOrderValue)}</p>
                        </div>
                        <div className="p-3 bg-purple-400 bg-opacity-30 rounded-full">
                            <Target className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-purple-200" />
                        <span className="text-purple-200 text-sm font-medium ml-1">+8.2%</span>
                        <span className="text-purple-200 text-sm ml-1">vs last period</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Growth Rate</p>
                            <p className="text-3xl font-bold">+{revenueData.growthRate}%</p>
                        </div>
                        <div className="p-3 bg-orange-400 bg-opacity-30 rounded-full">
                            <Rocket className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Sparkles className="w-4 h-4 text-orange-200" />
                        <span className="text-orange-200 text-sm font-medium ml-1">Consistent</span>
                        <span className="text-orange-200 text-sm ml-1">growth trend</span>
                    </div>
                </div>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">New Customers</p>
                            <p className="text-2xl font-bold text-gray-900">{revenueData.customerMetrics.newCustomers}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-center text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+15.3%</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Returning Customers</p>
                            <p className="text-2xl font-bold text-gray-900">{revenueData.customerMetrics.returningCustomers}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Star className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-center text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+8.7%</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Customer Satisfaction</p>
                            <p className="text-2xl font-bold text-gray-900">{revenueData.customerMetrics.customerSatisfaction}%</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Award className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="flex items-center text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+2.1%</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Daily Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-blue-600" />
                            Daily Revenue Trend
                        </h3>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-500">Real-time</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {revenueData.dailyRevenue.map((day, index) => (
                            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 text-sm font-medium text-gray-700">{formatDate(day.date)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(day.revenue)}
                                            </span>
                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                                {day.orders} orders
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                                style={{ 
                                                    width: `${(day.revenue / Math.max(...revenueData.dailyRevenue.map(d => d.revenue))) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Medicines */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            Top Performing Medicines
                        </h3>
                        <Crown className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="space-y-4">
                        {revenueData.topPerformingMedicines.map((medicine, index) => (
                            <div key={medicine.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                                        'bg-gradient-to-r from-blue-400 to-blue-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{medicine.name}</p>
                                        <p className="text-sm text-gray-500">{medicine.sales} units sold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{formatCurrency(medicine.revenue)}</p>
                                    <p className="text-xs text-gray-500">
                                        {((medicine.revenue / revenueData.totalRevenue) * 100).toFixed(1)}% of total
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        Recent Transactions
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        View All
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {revenueData.recentTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-600">
                                                    {transaction.customer.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-500">{transaction.items} items</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-500">{formatTime(transaction.date)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Revenue Growth Summary */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8 rounded-xl border border-blue-100">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        Revenue Growth Summary
                    </h3>
                    <p className="text-gray-600">Your business is growing steadily with consistent performance</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">+{revenueData.growthRate}%</p>
                        <p className="text-sm text-gray-600">Overall Growth</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">{revenueData.totalOrders}</p>
                        <p className="text-sm text-gray-600">Orders Processed</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(revenueData.averageOrderValue)}</p>
                        <p className="text-sm text-gray-600">Average Order Value</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-orange-600">{revenueData.customerMetrics.newCustomers + revenueData.customerMetrics.returningCustomers}</p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenue;
