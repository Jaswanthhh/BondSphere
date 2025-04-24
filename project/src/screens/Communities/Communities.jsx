import React, { useState } from 'react';
import { Search, Users, Shield, Lock, UserPlus } from 'lucide-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

export const Communities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [communities, setCommunities] = useState([
    {
      id: '1',
      name: 'Tech Innovators Hub',
      description: 'A verified community for professional tech innovators. Requires work email verification.',
      members: 1200,
      category: 'tech',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      type: 'verified',
      isJoined: false
    },
    {
      id: '2',
      name: 'Finance Professionals',
      description: 'Connect with finance professionals worldwide.',
      members: 850,
      category: 'finance',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f',
      type: 'normal',
      isJoined: false
    },
    {
      id: '3',
      name: 'Startup Founders Circle',
      description: 'An exclusive community for verified startup founders.',
      members: 320,
      category: 'startup',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
      type: 'private',
      isJoined: false
    }
  ]);

  // If we're on a nested route, render the Outlet
  if (location.pathname !== '/home/communities') {
    return <Outlet />;
  }

  const categories = [
    { id: 'all', name: 'All Communities' },
    { id: 'tech', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'startup', name: 'Startups' }
  ];

  const handleJoinCommunity = (e, communityId) => {
    e.stopPropagation(); // Prevent card click event
    setCommunities(prevCommunities =>
      prevCommunities.map(community =>
        community.id === communityId
          ? { ...community, isJoined: !community.isJoined }
          : community
      )
    );
  };

  const handleCommunityClick = (community) => {
    navigate(`/home/communities/${community.id}`);
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    const matchesType = selectedType === 'all' || community.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-600 mt-1">Connect with professionals who share your interests</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          aria-label="Filter by community type"
        >
          <option value="all">All Types</option>
          <option value="verified">Verified Only</option>
          <option value="normal">Normal</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map(community => (
          <div
            key={community.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCommunityClick(community)}
          >
            <div className="relative h-48">
              <img
                src={community.image}
                alt={community.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => handleJoinCommunity(e, community.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                    community.isJoined
                      ? 'bg-white text-blue-600 border border-blue-600'
                      : community.type === 'verified'
                      ? 'bg-green-600 text-white'
                      : community.type === 'private'
                      ? 'bg-purple-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                  aria-label={community.isJoined ? 'Leave community' : 'Join community'}
                >
                  <UserPlus className="w-4 h-4" />
                  {community.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
              {community.type === 'verified' && (
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Verified</span>
                </div>
              )}
              {community.type === 'private' && (
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Private</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{community.name}</h3>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span>{community.members.toLocaleString()} members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No communities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}; 