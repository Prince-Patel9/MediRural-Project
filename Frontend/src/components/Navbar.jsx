import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-md' 
        : 'bg-blue-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Hamburger Menu for Mobile */}
            <button
              onClick={toggleMenu}
              className={`lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink to="/" isActive={isActive('/')} scrolled={scrolled}>
                Home
              </NavLink>
              <NavLink to="/medicines" isActive={isActive('/medicines')} scrolled={scrolled}>
                Medicines
              </NavLink>
              <NavLink to="/about" isActive={isActive('/about')} scrolled={scrolled}>
                About
              </NavLink>
              <NavLink to="/contact" isActive={isActive('/contact')} scrolled={scrolled}>
                Contact
              </NavLink>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span 
              className={`font-bold text-2xl tracking-wider cursor-pointer transition-colors ${
                scrolled ? 'text-gray-800' : 'text-white'
              }`}
              onClick={() => navigate("/")}
            >
              MediRural
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1">
            
            
            {/* Cart Icon */}
            <Link to="/cart">
              <div
                className={`relative p-2 rounded-lg transition-colors ${
                  scrolled 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {/* Cart Badge */}
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>
            
            {/* User Menu */}
            <UserMenu scrolled={scrolled} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            <MobileNavLink to="/" isActive={isActive('/')} onClick={toggleMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/medicines" isActive={isActive('/medicines')} onClick={toggleMenu}>
              Medicines
            </MobileNavLink>
            <MobileNavLink to="/about" isActive={isActive('/about')} onClick={toggleMenu}>
              About
            </MobileNavLink>
            <MobileNavLink to="/contact" isActive={isActive('/contact')} onClick={toggleMenu}>
              Contact
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  )
}

// NavLink Component for Desktop with animated underline
const NavLink = ({ to, children, isActive, scrolled }) => (
  <Link to={to}>
    <div
      className={`relative font-medium transition-colors ${
        scrolled ? 'text-gray-700' : 'text-white'
      }`}
    >
      {children}
      {/* Animated underline */}
      <div className="absolute -bottom-1 left-0 right-0 h-0.5">
        <div 
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            scrolled ? 'bg-blue-600' : 'bg-white'
          }`}
          style={{
            transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left'
          }}
        />
      </div>
    </div>
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link to={to} onClick={onClick}>
    <div
      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </div>
  </Link>
);

export default Navbar

