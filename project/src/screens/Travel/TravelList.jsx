import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, MapPin, Calendar, Users, Filter, Trash2 } from 'lucide-react';
import { CreateListing } from './CreateListing';
import { travelApi } from '../../services/api';

export const TravelList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId'); // Assumes you store userId in localStorage after login

  // Fetch travel listings from backend
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await travelApi.getListings();
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleTravelClick = (post) => {
    navigate(`/home/travel/${post._id || post.id}`, { state: { listing: post } });
  };

  const handleCreateListing = async (newListing) => {
    try {
      // Remove MongoDB fields if present
      const { _id, createdAt, __v, ...cleanData } = newListing;
      await travelApi.createListing(cleanData);
      setIsCreateModalOpen(false);
      fetchListings(); // Refresh list from backend
    } catch (err) {
      // Optionally show error
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await travelApi.deleteListing(id);
      fetchListings();
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plane className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-semibold">Travel Connect</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            Add Place
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Create Travel Plan
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Travel Posts */}
      <div className="space-y-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          Array.isArray(posts) && posts
            .filter(post => 
              post.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((post) => (
              <div
                key={post._id || post.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
                onClick={() => handleTravelClick(post)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={post.creator?.avatar || '/default-avatar.png'}
                    alt={post.creator?.fullName || post.creator?.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{post.creator?.fullName || post.creator?.username || 'User'}</h3>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{post.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.dates}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{Array.isArray(post.travelers) ? post.travelers.length : (post.travelers || 1)} travelers</span>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{post.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(post.interests || []).map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Delete button, always show for demo/testing */}
                  <button
                    className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 rounded-full z-10"
                    onClick={e => { e.stopPropagation(); handleDeleteListing(post._id); }}
                    title="Delete Listing"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <CreateListing
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateListing}
        />
      )}
    </div>
  );
}; 