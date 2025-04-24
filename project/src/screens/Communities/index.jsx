import React from 'react';
import { Users, Search, Plus } from 'lucide-react';
import { Communities } from './Communities';
import { CommunityHome } from './CommunityHome';
import { CommunityDetails } from './CommunityDetails';

const communities = [
  {
    id: 1,
    name: 'Tech Innovators',
    members: 1234,
    image: '/communities/tech.jpg',
    description: 'A community for technology enthusiasts and innovators.'
  },
  {
    id: 2,
    name: 'Digital Nomads',
    members: 856,
    image: '/communities/nomads.jpg',
    description: 'Connect with remote workers and digital nomads worldwide.'
  },
  {
    id: 3,
    name: 'Startup Hub',
    members: 2341,
    image: '/communities/startup.jpg',
    description: 'Network with startup founders and entrepreneurs.'
  }
];

export const CommunitiesComponent = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-semibold">Communities</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5" />
          Create Community
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search communities..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gray-100 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <img
                src={community.image}
                alt={community.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x225';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{community.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{community.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{community.members.toLocaleString()} members</span>
              </div>
              <button className="w-full mt-4 py-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Communities, CommunityHome, CommunityDetails }; 