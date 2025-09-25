import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProviders } from '../services/providerService';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Star, Filter, X, CheckCircle } from 'lucide-react';

interface Provider {
  _id: string;
  name: string;
  serviceType: string;
  address: string;
  phone: string;
  isVerified: boolean;
  reviews: { rating: number }[];
}

const Providers: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    serviceType: '',
    minRating: 0,
    verifiedOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const serviceTypes = ['Cleaning', 'Plumbing', 'Electrical', 'Gardening', 'Tutoring', 'Consulting', 'Other'];

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'message' in err) {
          setError((err as { message: string }).message);
        } else {
          setError('Failed to fetch providers');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Calculate average rating for a provider
  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  // Filter providers based on search and filters
  const filteredProviders = providers.filter((provider) => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Service type filter
    const matchesServiceType = filters.serviceType === '' || 
      provider.serviceType === filters.serviceType;
    
    // Rating filter
    const avgRating = getAverageRating(provider.reviews);
    const matchesRating = avgRating >= filters.minRating;
    
    // Verified filter
    const matchesVerified = !filters.verifiedOnly || provider.isVerified;
    
    return matchesSearch && matchesServiceType && matchesRating && matchesVerified;
  });

  const resetFilters = () => {
    setFilters({
      serviceType: '',
      minRating: 0,
      verifiedOnly: false,
    });
  };

  // For demo purposes, if no providers are fetched from the API, use some sample data
  const sampleProviders: Provider[] = [
    {
      _id: '1',
      name: 'Clean Home Services',
      serviceType: 'Cleaning',
      address: '123 Main St, Anytown',
      phone: '(555) 123-4567',
      isVerified: true,
      reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    },
    {
      _id: '2',
      name: 'FixIt Plumbing',
      serviceType: 'Plumbing',
      address: '456 Oak Ave, Somewhere',
      phone: '(555) 987-6543',
      isVerified: true,
      reviews: [{ rating: 4 }, { rating: 3 }, { rating: 5 }],
    },
    {
      _id: '3',
      name: 'ElectriPro Solutions',
      serviceType: 'Electrical',
      address: '789 Elm Blvd, Nowhere',
      phone: '(555) 456-7890',
      isVerified: false,
      reviews: [{ rating: 5 }, { rating: 5 }],
    },
    {
      _id: '4',
      name: 'Green Thumb Gardens',
      serviceType: 'Gardening',
      address: '101 Pine Ln, Everywhere',
      phone: '(555) 234-5678',
      isVerified: true,
      reviews: [{ rating: 4 }, { rating: 4 }, { rating: 3 }],
    },
    {
      _id: '5',
      name: 'Knowledge Tutors',
      serviceType: 'Tutoring',
      address: '202 Cedar St, Anytown',
      phone: '(555) 345-6789',
      isVerified: false,
      reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    },
    {
      _id: '6',
      name: 'Business Advisory Group',
      serviceType: 'Consulting',
      address: '303 Maple Dr, Somewhere',
      phone: '(555) 567-8901',
      isVerified: true,
      reviews: [{ rating: 4 }, { rating: 4 }, { rating: 4 }],
    },
  ];

  // Use sample data if no providers are loaded from API
  const displayProviders = providers.length > 0 ? filteredProviders : sampleProviders;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Service Providers</h1>
          <p className="text-gray-600 max-w-3xl">
            Browse through our list of verified service providers or use the search and filters 
            to find the perfect match for your needs.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or service type..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Filters
            {(filters.serviceType || filters.minRating > 0 || filters.verifiedOnly) && (
              <span className="ml-2 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                {(filters.serviceType ? 1 : 0) + (filters.minRating > 0 ? 1 : 0) + (filters.verifiedOnly ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="flex items-center">
                <button 
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-500 mr-4"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Types</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, minRating: rating })}
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        filters.minRating === rating 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'All' : rating}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verifiedOnly"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verifiedOnly" className="ml-2 text-sm text-gray-700">
                    Show verified providers only
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            <p>{error}</p>
          </div>
        ) : displayProviders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No providers found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any providers matching your criteria. Try adjusting your filters or search term.
            </p>
            {(searchTerm || filters.serviceType || filters.minRating > 0 || filters.verifiedOnly) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  resetFilters();
                }}
                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                <X size={16} className="mr-1" />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProviders.map((provider) => {
              const avgRating = getAverageRating(provider.reviews);
              
              return (
                <motion.div
                  key={provider._id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{provider.name}</h2>
                      {provider.isVerified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="text-indigo-600 font-medium mb-3">{provider.serviceType}</div>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {avgRating.toFixed(1)} ({provider.reviews.length} reviews)
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-start">
                        <MapPin size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{provider.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{provider.phone}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/providers/${provider._id}`}
                      className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;