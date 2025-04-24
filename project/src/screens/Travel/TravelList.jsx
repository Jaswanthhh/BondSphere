import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, MapPin, Calendar, Users, Filter } from 'lucide-react';
import { CreateListing } from './CreateListing';

const travelPosts = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      avatar: '/avatars/alex.jpg'
    },
    destination: 'Bali, Indonesia',
    dates: '15 Aug - 30 Aug 2024',
    startDate: '2024-08-15',
    endDate: '2024-08-30',
    travelers: 2,
    maxParticipants: 4,
    currentParticipants: 2,
    type: 'flight',
    description: 'Looking for travel buddies to explore Bali! Planning to visit beaches, temples, and try local cuisine.',
    interests: ['Beach', 'Culture', 'Food'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    organizer: {
      name: 'Alex Johnson',
      avatar: '/avatars/alex.jpg'
    }
  },
  {
    id: '2',
    user: {
      name: 'Sarah Smith',
      avatar: '/avatars/sarah.jpg'
    },
    destination: 'Barcelona, Spain',
    dates: '1 Sep - 10 Sep 2024',
    startDate: '2024-09-01',
    endDate: '2024-09-10',
    travelers: 3,
    maxParticipants: 5,
    currentParticipants: 3,
    type: 'flight',
    description: 'Planning a photography tour around Barcelona. Would love to connect with fellow photographers!',
    interests: ['Photography', 'Architecture', 'Art'],
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    organizer: {
      name: 'Sarah Smith',
      avatar: '/avatars/sarah.jpg'
    }
  }
];

export const TravelList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState(travelPosts);
  const navigate = useNavigate();

  const handleTravelClick = (post) => {
    navigate(`/home/travel/${post.id}`, { state: { listing: post } });
  };

  const handleCreateListing = (newListing) => {
    const listingWithId = {
      ...newListing,
      id: String(posts.length + 1),
      user: {
        name: 'Current User', // This should come from auth context in a real app
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      },
      organizer: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      },
      currentParticipants: 1,
      travelers: 1
    };
    setPosts([listingWithId, ...posts]);
    setIsCreateModalOpen(false);
    navigate(`/home/travel/${listingWithId.id}`, { state: { listing: listingWithId } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plane className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-semibold">Travel Connect</h1>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Create Travel Plan
        </button>
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
        {posts
          .filter(post => 
            post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTravelClick(post)}
          >
            <div className="flex items-start gap-4">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{post.user.name}</h3>
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
                    <span>{post.travelers} travelers</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{post.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
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