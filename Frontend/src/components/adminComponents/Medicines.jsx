import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Edit, Eye, Filter, IndianRupee, Package, Plus, Search, Trash2 } from 'lucide-react'
import SearchFilterBar from './SearchFilterBar';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Medicines = () => {
  const { token } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCat , setSelectedCat] = useState('all');
  const [searchTerm , setSearchTerm] = useState('')

  const navigate = useNavigate()
  const fetchMedicines = async (search = '', category = 'all') => {
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      const url = `https://medirural.onrender.com/api/medicines${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axios.get(url);
      
      if (response.data.success) {
        setMedicines(response.data.medicines);
      } else {
        setError('Error fetching medicines: ' + (response.data.message || 'Unknown error'));
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching medicines: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMedicines();
  }, []);
  
  //getting all the categories
  const category = ['all', ...new Set(medicines.map(medicine=>medicine.category))]

  let stockIndicator = (price) =>{
    if (price <= 0) return 'Out of stock'
    if (price <= 100) return 'Low stock'
    if (price > 100) return 'In stock'
  }

  let handleShow = (id) =>{
    
  }
  const handleEdit = (id) => {
    navigate(`/admin/medicines/edit/${id}`);
  };
  let handleDelete = async (id) => {
    setLoading(true);
  
    try {
      const res = await axios.delete(`https://medirural.onrender.com/api/medicines/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (res.data.success) {
        await fetchMedicines();
        alert('Deleted successfully!')
      } else {
        alert('Error occurred while deleting');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete medicine');
    } finally {
      setLoading(false);
    }
  };

  // Update search and category handlers
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    fetchMedicines(newSearchTerm, selectedCat);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCat(newCategory);
    fetchMedicines(searchTerm, newCategory);
  };

  // Add loading and error states
  if (loading) {
    return (
      <div className='min-h-screen p-6 bg-gray-50 flex justify-center items-center'>
        <div className='text-lg font-semibold'>Loading medicines...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen p-6 bg-gray-50 flex justify-center items-center'>
        <div className='text-red-600 font-semibold'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-6 bg-gray-50'>

      <div className='flex items-center bg-white rounded-lg py-4 px-6 mb-6 justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex bg-blue-100 h-9 w-9 rounded-lg justify-center items-center text-blue-600'>
            <Package />
          </div>
          <div className='flex justify-center flex-col'>
            <h1 className='text-2xl font-bold'>Medicine Management</h1>
            <p className='text-md'>Manage Your Pharmacy network</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors" onClick={()=>navigate('/admin/medicines/add')}>
          <Plus className="h-4 w-4" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* filter */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        selectedCategory={selectedCat} 
        setSearchTerm={handleSearchChange}
        setSelectedCategory={handleCategoryChange}
        categories={category}
      />

      {/* Table Layout */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicines.map((medicine) => (
                <tr key={medicine._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img className="h-12 w-12 object-cover rounded-lg border" src={medicine.imageUrl} alt={medicine.name} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{medicine.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{medicine.description}</td>
                  <td className="px-6 py-4 font-medium text-black flex items-center gap-1">
                    <IndianRupee className='w-3 h-3 text-black' />
                    {medicine.price}
                  </td>
                  <td className="px-3 py-4">
                    <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${medicine.stock <= 0 ? 'bg-red-100 text-red-700' : medicine.stock <= 100 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>{medicine.stock <= 0 ? 'Out of stock' : medicine.stock <= 100 ? 'Low stock' : 'In stock'}</div>
                    <div className="ml-2 text-xs text-gray-500">({medicine.stock})</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-gray-100 text-gray-700 rounded-lg text-xs px-2 py-0.5">{medicine.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3 text-gray-600">
                      <button className='hover:cursor-pointer hover:text-gray-900 transition-colors ease-in' onClick={()=>handleShow(medicine._id)}>
                        <Eye className='w-5 h-5'/>
                      </button>
                      <button className='hover:cursor-pointer hover:text-gray-900 transition-colors ease-in' onClick={()=>handleEdit(medicine._id)}>
                        <Edit className='w-5 h-5'/>
                      </button>
                      <button className='hover:cursor-pointer hover:text-gray-900 transition-colors ease-in' onClick={()=>handleDelete(medicine._id)}>
                        <Trash2 className='w-5 h-5'/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {medicines.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">No medicines found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Medicines
