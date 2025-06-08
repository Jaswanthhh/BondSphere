import React, { useState, useEffect } from 'react';
import { Search, Users, Shield, Lock, UserPlus, Plus } from 'lucide-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { communities as communitiesApi } from '../../services/api';

export const Communities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    category: 'all',
    type: 'normal',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const res = await communitiesApi.getAll();
        setCommunities(res.data);
      } catch (err) {
        setCommunities([]);
      }
      setLoading(false);
    };
    fetchCommunities();
  }, []);

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

  const handleJoinCommunity = async (e, communityId) => {
    e.stopPropagation();
    setCommunities(prevCommunities =>
      prevCommunities.map(community =>
        (community._id || community.id) === communityId
          ? { ...community, isJoined: !community.isJoined }
          : community
      )
    );
    try {
      const community = communities.find(c => (c._id || c.id) === communityId);
      if (community && !community.isJoined) {
        await communitiesApi.join(communityId);
      } else {
        await communitiesApi.leave(communityId);
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const handleCommunityClick = (community) => {
    navigate(`/home/communities/${community._id || community.id}`);
  };

  const handleAddCommunity = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await communitiesApi.create(form);
      setShowModal(false);
      setForm({ name: '', description: '', image: '', category: 'all', type: 'normal' });
      // Refresh list
      const res = await communitiesApi.getAll();
      setCommunities(res.data);
    } catch (err) {
      // Optionally show error
    } finally {
      setCreating(false);
    }
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
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" /> Add Community
        </button>
      </div>
      {/* Modal for adding community */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddCommunity}
            className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg space-y-4"
          >
            <h2 className="text-xl font-bold mb-2">Add Community</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
            />
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="all">All</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="startup">Startups</option>
            </select>
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="verified">Verified</option>
              <option value="private">Private</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowModal(false)}
                disabled={creating}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={creating}
              >{creating ? 'Adding...' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}
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
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredCommunities.map(community => (
            <div
              key={community._id || community.id}
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
                    onClick={(e) => handleJoinCommunity(e, community._id || community.id)}
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
                  <span>{community.members?.toLocaleString() || 0} members</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredCommunities.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No communities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
