import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="text-white font-bold text-xl flex items-center mb-4">
              <Calendar className="mr-2" />
              <span>ServiceHub</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Connecting you with the best service providers in your area. Book appointments with ease and manage your schedule effortlessly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/providers" className="text-gray-400 hover:text-white transition-colors">Find Providers</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Service Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home Cleaning</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Plumbing</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Electrical Work</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Personal Training</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Consulting</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={20} className="mr-2 text-indigo-400 mt-1" />
                <span>support@servicehub.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 text-indigo-400 mt-1" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;