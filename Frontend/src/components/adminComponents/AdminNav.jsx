import React, { useState } from 'react';
import { Menu, X, Shield, Package, ShoppingCart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import UserMenu from '../UserMenu';
const AdminNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

const navigate = useNavigate();

  const navItems = [
    { to: '/admin/medicines', label: 'Medicines', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart }
  ];

  const Link = ({ to, onClick, className, children }) => (
    <a 
      href={to} 
      onClick={(e) => { 
        e.preventDefault(); 
        if(onClick) onClick(); 
        navigate(to); 
      }} 
      className={className}
    >
      {children}
    </a>
  );

  return (
    <div className="relative">
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg px-4 sm:px-6 lg:px-8 py-4 relative backdrop-blur-sm">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          {/* Left side for logo/menu toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105 active:scale-95"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div 
                className={`transition-transform duration-300 ${menuOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-4">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.to}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <div
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 text-xl font-bold cursor-pointer hover:text-blue-100 transition-all duration-200 hover:scale-105 transform"
            >
              <Shield className="w-6 h-6" />
              <span>AdminPanel</span>
            </div>
          </div>

          {/* Right side UserMenu */}
          <div className="flex items-center">
            {/* Mock UserMenu component */}
            <div className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors duration-200">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu with smooth animations */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen 
              ? 'max-h-80 opacity-100 transform translate-y-0' 
              : 'max-h-0 opacity-0 transform -translate-y-2'
          }`}
        >
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 px-2">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.to}
                    className={`transition-all duration-300 ease-out ${
                      menuOpen 
                        ? 'opacity-100 transform translate-x-0' 
                        : 'opacity-0 transform -translate-x-4'
                    }`}
                    style={{ 
                      transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' 
                    }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-102 hover:translate-x-2 transform group"
                    >
                      <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>{item.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Backdrop overlay for mobile menu */}
      {menuOpen && (
        <div
          className={`md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default AdminNav;