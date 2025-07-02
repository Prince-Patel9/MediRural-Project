import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Company Info */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4">MediRural</h3>
          <p className="text-gray-300 leading-relaxed">
            Empowering rural communities with accessible healthcare solutions. 
            Your trusted partner in medicine delivery and healthcare services.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/medicines">Medicines</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center md:text-right">
          <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
          <div className="flex justify-center md:justify-end space-x-4">
            <SocialLink href="/facebook" icon="facebook" />
            <SocialLink href="/instagram" icon="instagram" />
            <SocialLink href="/linkedin" icon="linkedin" />
            <SocialLink href="/twitter" icon="twitter" />
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 MediRural Private Limited. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/help" className="text-gray-400 hover:text-white transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// Footer Link Component
const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="block text-gray-300 hover:text-white transition-colors"
  >
    {children}
  </a>
);

// Social Link Component
const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
  >
    <i className={`fab fa-${icon} text-white text-lg`}></i>
  </a>
);

export default Footer;
