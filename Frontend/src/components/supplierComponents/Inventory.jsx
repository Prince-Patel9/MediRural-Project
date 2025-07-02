import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    Package, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Search,
    Filter,
    Plus,
    Minus,
    Edit3,
    Save,
    X
} from 'lucide-react';

const Inventory = () => {
    const { token } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStock, setUpdatingStock] = useState({});
    const [manualStock, setManualStock] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [editingStock, setEditingStock] = useState({});
    const navigate = useNavigate();
    const intervalRef = useRef(null);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        fetchMedicines();
        
        // Set up auto-refresh
        intervalRef.current = setInterval(() => {
            fetchMedicines(true); // Silent refresh
        }, 30000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [token]);

    const fetchMedicines = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
                setIsRefreshing(true);
            }
            
            const response = await axios.get('https://medirural.onrender.com/api/medicines/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                setMedicines(response.data.medicines);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleStockUpdate = async (medicineId, newStock) => {
        setUpdatingStock(prev => ({ ...prev, [medicineId]: true }));
        try {
            const response = await axios.patch(`https://medirural.onrender.com/api/medicines/${medicineId}`, {
                stock: newStock
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                setMedicines(prev => prev.map(medicine => 
                    medicine._id === medicineId 
                        ? { ...medicine, stock: newStock }
                        : medicine
                ));
                setManualStock(prev => ({ ...prev, [medicineId]: '' }));
                setEditingStock(prev => ({ ...prev, [medicineId]: false }));
            } else {
                alert('Failed to update stock: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Error updating stock: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdatingStock(prev => ({ ...prev, [medicineId]: false }));
        }
    };

    const handleManualStockSubmit = (medicineId) => {
        const newStock = parseInt(manualStock[medicineId]);
        
        if (isNaN(newStock) || newStock < 0) {
            alert('Please enter a valid stock number');
            return;
        }
        
        handleStockUpdate(medicineId, newStock);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { status: 'out', color: 'red', icon: <XCircle className="w-4 h-4" />, text: 'Out of Stock' };
        if (stock <= 50) return { status: 'critical', color: 'red', icon: <AlertTriangle className="w-4 h-4" />, text: 'Critical Low' };
        if (stock <= 100) return { status: 'low', color: 'orange', icon: <AlertTriangle className="w-4 h-4" />, text: 'Low Stock' };
        if (stock <= 200) return { status: 'medium', color: 'yellow', icon: <Package className="w-4 h-4" />, text: 'Medium Stock' };
        return { status: 'good', color: 'green', icon: <CheckCircle className="w-4 h-4" />, text: 'In Stock' };
    };

    const getStockColorClasses = (status) => {
        const colors = {
            out: 'bg-red-100 text-red-800 border-red-200',
            critical: 'bg-red-100 text-red-800 border-red-200',
            low: 'bg-orange-100 text-orange-800 border-orange-200',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            good: 'bg-green-100 text-green-800 border-green-200'
        };
        return colors[status] || colors.good;
    };

    // Filter and search medicines
    const filteredMedicines = medicines
        .filter(medicine => {
            const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || 
                (filterStatus === 'low' && medicine.stock <= 100) ||
                (filterStatus === 'out' && medicine.stock === 0) ||
                (filterStatus === 'good' && medicine.stock > 100);
            const matchesLowStockFilter = !showLowStockOnly || medicine.stock <= 100;
            
            return matchesSearch && matchesFilter && matchesLowStockFilter;
        })
        .sort((a, b) => a.stock - b.stock);

    // Calculate summary stats
    const summaryStats = {
        total: medicines.length,
        outOfStock: medicines.filter(m => m.stock === 0).length,
        lowStock: medicines.filter(m => m.stock <= 100 && m.stock > 0).length,
        inStock: medicines.filter(m => m.stock > 100).length,
        totalValue: medicines.reduce((sum, m) => sum + (m.stock * m.price), 0)
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading Inventory...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px] text-red-600">
                <div className="text-center">
                    <XCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Error loading inventory</p>
                    <p className="text-sm text-gray-600">{error}</p>
                    <button 
                        onClick={() => fetchMedicines()}
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
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Inventory Management</h1>
                        <p className="text-gray-600">Monitor and manage your medicine stock levels</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                        <button
                            onClick={() => fetchMedicines()}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Items</p>
                            <p className="text-2xl font-bold">{summaryStats.total}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium">Out of Stock</p>
                            <p className="text-2xl font-bold">{summaryStats.outOfStock}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Low Stock</p>
                            <p className="text-2xl font-bold">{summaryStats.lowStock}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">In Stock</p>
                            <p className="text-2xl font-bold">{summaryStats.inStock}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Value</p>
                            <p className="text-lg font-bold">₹{summaryStats.totalValue.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-200" />
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Stock</option>
                            <option value="out">Out of Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="good">Good Stock</option>
                        </select>
                        
                        <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={showLowStockOnly}
                                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium">Low Stock Only</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Medicine</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Current Stock</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMedicines.map((medicine) => {
                                const stockStatus = getStockStatus(medicine.stock);
                                return (
                                    <tr key={medicine._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{medicine.name}</p>
                                                <p className="text-sm text-gray-500">{medicine.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {medicine.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">₹{medicine.price}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStockColorClasses(stockStatus.status)}`}>
                                                {stockStatus.icon}
                                                {stockStatus.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingStock[medicine._id] ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={manualStock[medicine._id] || ''}
                                                        onChange={(e) => setManualStock(prev => ({ ...prev, [medicine._id]: e.target.value }))}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        min="0"
                                                    />
                                                    <button
                                                        onClick={() => handleManualStockSubmit(medicine._id)}
                                                        disabled={updatingStock[medicine._id]}
                                                        className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingStock(prev => ({ ...prev, [medicine._id]: false }));
                                                            setManualStock(prev => ({ ...prev, [medicine._id]: '' }));
                                                        }}
                                                        className="p-1 text-gray-600 hover:text-gray-800"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">{medicine.stock}</span>
                                                    <button
                                                        onClick={() => setEditingStock(prev => ({ ...prev, [medicine._id]: true }))}
                                                        className="p-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStockUpdate(medicine._id, medicine.stock + 1)}
                                                    disabled={updatingStock[medicine._id]}
                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStockUpdate(medicine._id, Math.max(0, medicine.stock - 1))}
                                                    disabled={updatingStock[medicine._id] || medicine.stock === 0}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {filteredMedicines.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No medicines found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
