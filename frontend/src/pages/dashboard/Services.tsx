import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { addProvider, getProviderByEmail } from '../../services/providerService';

const ProviderForm: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [provider, setProvider] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    address: '',
  });

  const [foundProvider, setFoundProvider] = useState<any | null>([]);

  const userData = localStorage.getItem("user");

  let email = "";
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      email = parsedUser.id; // this is the email
      console.log("Logged in provider email:", email);
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }

  // Hardcoded or passed-in email
  const emailToFetch = email; // change this or use props

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderByEmail(emailToFetch);
        setFoundProvider(data);
        toast.success('Provider found');
      } catch (err: any) {
        setFoundProvider(null);
        if (err.response && err.response.status === 404) {
          toast.warn('No provider found with that email');
        } else {
          toast.error('Error fetching provider');
        }
      }
    };

    fetchProvider();
  }, [emailToFetch]);

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addProvider(provider);
      toast.success('Provider added successfully!');
      setProvider({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        address: '',
      });
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add provider');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Providers</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Provider
        </button>
      </div>

      {/* Display provider fetched by email */}
      {foundProvider.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Found Providers</h3>
            {foundProvider.map((provider, index) => (
              <div key={index} className="p-4 border rounded-md bg-gray-50">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Provider #{index + 1}</h4>
                <p><strong>Name:</strong> {provider.name}</p>
                <p><strong>Email:</strong> {provider.email}</p>
                <p><strong>Phone:</strong> {provider.phone}</p>
                <p><strong>Service Type:</strong> {provider.serviceType}</p>
                <p><strong>Address:</strong> {provider.address}</p>
              </div>
            ))}
          </div>
        )}


      {/* Add provider modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Provider</h3>
            <form onSubmit={handleAddProvider}>
              {['name', 'email', 'phone', 'serviceType', 'address'].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 font-medium mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={(provider as any)[field]}
                    onChange={(e) => setProvider({ ...provider, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required={field !== 'address'}
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setProvider({
                      name: '',
                      email: '',
                      phone: '',
                      serviceType: '',
                      address: '',
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Provider
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProviderForm;
