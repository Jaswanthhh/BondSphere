import React, { useState, useEffect } from 'react';
import { Search, Users, Filter, Tag, Briefcase, MapPin, Star, UserPlus, MoreHorizontal } from 'lucide-react';
import { connectionsApi } from '../../services/api';

export const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await connectionsApi.getConnections();
        setConnections(res.data);
        setFilteredConnections(res.data);
      } catch (err) {
        setError('Failed to load connections.');
      }
      setLoading(false);
    };
    fetchConnections();
  }, []);

  const groups = ['Design Community', 'Tech Leaders', 'Developer Network', 'Tech Innovators', 'Startup Founders'];
  const tags = ['Design', 'Engineering', 'Leadership', 'Product', 'Marketing', 'Sales'];

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterConnections(query, selectedGroups, selectedTags);
  };

  const handleGroupSelect = (group) => {
    const updatedGroups = selectedGroups.includes(group)
      ? selectedGroups.filter(g => g !== group)
      : [...selectedGroups, group];
    setSelectedGroups(updatedGroups);
    filterConnections(searchQuery, updatedGroups, selectedTags);
  };

  const handleTagSelect = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    filterConnections(searchQuery, selectedGroups, updatedTags);
  };

  const filterConnections = (query, groups, tags) => {
    let filtered = connections;

    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(connection =>
        connection.name.toLowerCase().includes(searchLower) ||
        connection.role.toLowerCase().includes(searchLower) ||
        connection.company.toLowerCase().includes(searchLower)
      );
    }

    if (groups.length > 0) {
      filtered = filtered.filter(connection =>
        connection.groups.some(group => groups.includes(group))
      );
    }

    if (tags.length > 0) {
      filtered = filtered.filter(connection =>
        connection.tags.some(tag => tags.includes(tag))
      );
    }

    filtered = sortConnections(filtered);
    setFilteredConnections(filtered);
  };

  const sortConnections = (connections) => {
    switch (sortBy) {
      case 'recent':
        return [...connections].sort((a, b) => 
          new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime()
        );
      case 'strength':
        return [...connections].sort((a, b) => b.connectionStrength - a.connectionStrength);
      case 'name':
        return [...connections].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return connections;
    }
  };

  // Example add/remove connection handlers (implement as needed)
  const handleAddConnection = async (userId) => {
    try {
      await connectionsApi.addConnection(userId);
      // Optionally refetch or update state
    } catch (err) {
      setError('Failed to add connection.');
    }
  };

  const handleRemoveConnection = async (userId) => {
    try {
      await connectionsApi.removeConnection(userId);
      setConnections(connections.filter(c => c.id !== userId));
      setFilteredConnections(filteredConnections.filter(c => c.id !== userId));
    } catch (err) {
      setError('Failed to remove connection.');
    }
  };

  if (loading) return <div>Loading connections...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Professional Network</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          <span>Add Connection</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search connections..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600'
              }`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort connections"
              title="Sort connections"
            >
              <option value="recent">Recent Interaction</option>
              <option value="strength">Connection Strength</option>
              <option value="name">Name</option>
            </select>
            <div className="flex border border-gray-200 rounded-lg">
              <button
                className={`px-3 py-2 ${view === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setView('grid')}
                aria-label="Grid view"
                title="Grid view"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                className={`px-3 py-2 ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setView('list')}
                aria-label="List view"
                title="List view"
              >
                <Tag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Groups</h3>
              <div className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <button
                    key={group}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedGroups.includes(group)
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => handleGroupSelect(group)}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connections Grid/List */}
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredConnections.map((connection) => (
          <div
            key={connection.id}
            className={`bg-white rounded-xl p-4 ${
              view === 'grid' ? '' : 'flex items-center'
            } border border-gray-100 hover:border-blue-200 transition-all`}
          >
            <div className={`flex ${view === 'grid' ? 'flex-col items-center text-center' : 'items-center gap-4'}`}>
              <img
                src={connection.avatar}
                alt={connection.name}
                className={`rounded-full ${view === 'grid' ? 'w-24 h-24 mb-4' : 'w-16 h-16'}`}
              />
              <div className={view === 'grid' ? 'w-full' : 'flex-1'}>
                <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                <p className="text-gray-600 text-sm">{connection.role}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{connection.company}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{connection.location}</span>
                </div>
                {view === 'grid' && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {connection.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={view === 'grid' ? 'mt-4 w-full' : 'flex items-center gap-4'}>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{connection.connectionStrength}%</span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="More options"
                  title="More options"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 