import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProviderById, addReview } from '../services/providerService';
import { motion } from 'framer-motion';
import { Star, Calendar, MapPin, Phone, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Provider, Availability } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const ProviderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });
  
  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      
      try {
        const data = await getProviderById(id);
        setProvider(data);
        if (data.availability && data.availability.length > 0) {
          setActiveDay(data.availability[0].day);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch provider details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/providers/${id}` } });
      return;
    }
    
    navigate(`/booking/${id}`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isAuthenticated) return;
    
    try {
      await addReview(id, {
        userId: (user as { id: string }).id || 'user1', // Use actual user ID from auth
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      
      // Update local state to show the new review immediately
      if (provider) {
        setProvider({
          ...provider,
          reviews: [
            {
              userId: (user as { id: string }).id || 'user1',
              rating: reviewData.rating,
              comment: reviewData.comment,
              createdAt: new Date().toISOString(),
            },
            ...provider.reviews,
          ],
        });
      }
      
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (!provider || !provider.reviews.length) return 0;
    const total = provider.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / provider.reviews.length;
  };

  // Get availability for the active day
  const getDayAvailability = () => {
    if (!provider || !provider.availability) return [];
    return provider.availability.filter(slot => slot.day === activeDay);
  };
  
  const dayAvailability = getDayAvailability();

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mt-12"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            <p>{error || 'Provider not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-800 mr-3">{provider.name}</h1>
                  {provider.isVerified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-indigo-600 text-lg font-medium">{provider.serviceType}</p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                <div className="flex mr-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star}
                      size={20}
                      className={star <= Math.round(getAverageRating()) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {getAverageRating().toFixed(1)} ({provider.reviews.length} reviews)
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{provider.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone size={20} className="text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{provider.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock size={20} className="text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">Working Hours</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Mon-Fri: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                  <p className="text-gray-700">
                    {provider.name} is a professional {provider.serviceType.toLowerCase()} service provider with years of experience in the industry. We pride ourselves on delivering high-quality service and customer satisfaction.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Availability</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`py-2 text-center text-sm rounded-md ${
                          activeDay === day
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  
                  {dayAvailability.length > 0 ? (
                    <div>
                      <p className="text-gray-700 mb-2">Available time slots on {activeDay}:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {dayAvailability.map((slot: Availability, index) => (
                          <div key={index} className="bg-green-50 text-green-800 text-sm text-center py-1 px-2 rounded">
                            {format(new Date(`2000-01-01T${slot.startTime}`), 'h:mm a')} - 
                            {format(new Date(`2000-01-01T${slot.endTime}`), 'h:mm a')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-2">No availability on {activeDay}</p>
                  )}
                </div>
                
                <button
                  onClick={handleBooking}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Write a Review
                </button>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {provider.reviews.length === 0 ? (
              <div className="p-6 md:p-8 text-center">
                <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
              </div>
            ) : (
              provider.reviews.map((review, index) => (
                <div key={index} className="p-6 md:p-8">
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800">User-{review.userId.substring(0, 5)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Write a Review for {provider.name}
              </h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={rating <= reviewData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share your experience with this service provider..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetail;