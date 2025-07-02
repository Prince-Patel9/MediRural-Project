import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllMedicines from './components/AllMedicines.jsx';
import SingleMedicine from './components/singleMedicine.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import './App.css';
import { CartProvider } from './context/CartContext';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import UserLayout from './layout/UserLayout.jsx'; 
import AdminLayout from './layout/AdminLayout.jsx';
import SupplierLayout from './layout/SupplierLayout.jsx';
import Medicines from './components/adminComponents/Medicines.jsx';
import { useAuth } from './context/AuthContext';
import AddMedicine from './components/adminComponents/AddMedicine.jsx';
import UpdateMedicine from './components/adminComponents/UpdateMedicine.jsx';
import AdminOrders from './components/adminComponents/Orders.jsx';
import Inventory from './components/supplierComponents/Inventory.jsx';
import SupplierOrders from './components/supplierComponents/Orders.jsx';
import Revenue from './components/supplierComponents/Revenue.jsx';
import Stats from './components/supplierComponents/Stats.jsx';
import Home from './components/Home.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { SnackbarProvider } from './context/SnackbarContext';
import OrderHistory from './components/OrderHistory.jsx';
// import Revenue from './components/supplierComponents/Revenue.jsx'; // TODO: Implement Revenue component

function App() {
  const { user, isAdmin, isSupplier, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <SnackbarProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<UserLayout />}>
              <Route path="/" element={<Home/>} />
                    <Route path='/medicines' element={<AllMedicines />} />
                    <Route path="/medicine/:id" element={<SingleMedicine />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/orders" element={<OrderHistory />} />
            </Route>
            <Route path='/admin' element={isAdmin ? <AdminLayout/> : <Login isAdmin={true}/>} >
              <Route index element={<Medicines/>} />
              <Route path='medicines' element={<Medicines/>} />
              <Route path='medicines/add' element={<AddMedicine/>} />
              <Route path='medicines/edit/:id' element={<UpdateMedicine/>} />
              <Route path='orders' element={<AdminOrders/>} />
            </Route>
            <Route path='/supplier' element={isSupplier ? <SupplierLayout/> : <Login isSupplier={true}/>} >
              <Route index element={<Revenue/>} />
              <Route path='inventory' element={<Inventory/>} />
              <Route path='orders' element={<SupplierOrders/>} />
              <Route path='revenue' element={<Revenue/>} />
              <Route path='stats' element={<Stats/>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </SnackbarProvider>
  );
}

export default App;
