import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Package, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Dashboard sub-pages
import MyAppointments from './dashboard/MyAppointments';
import Services from './dashboard/Services';

// Define a type for your user (adjust to your actual user shape)
interface UserType {
  fullName?: string;
  email?: string;
  role?: 'customer' | 'provider';
  id?: string;
}

const Dashboard: React.FC = () => {
  // Tell TypeScript user can be UserType or null/undefined
  const { user } = useAuth() as { user: UserType | null };

  const customerTabs = [
    { id: 'appointments', label: 'My Appointments', icon: Calendar, path: '/dashboard' },
  ];

  const providerTabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/dashboard' },
    { id: 'services', label: 'My Services', icon: Package, path: '/dashboard/services' },
  ];

  const tabs = user?.role === 'provider' ? providerTabs : customerTabs;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.fullName ?? user?.email ?? 'User'}!
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) => `
                  inline-flex items-center px-4 py-3 font-medium text-sm 
                  ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  transition-colors
                `}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<MyAppointments />} />
            {user?.role === 'provider' && (
              <>
                <Route path="/services" element={<Services />} />
              </>
            )}
          </Routes>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
