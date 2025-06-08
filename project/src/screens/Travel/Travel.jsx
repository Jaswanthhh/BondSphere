import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Filter, Plane, Train, Car, Ship, Globe, ArrowRight, Plus, X } from 'lucide-react';
import { TravelDetails } from './TravelDetails';
import { CreateListing } from './CreateListing';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { travelApi } from '../../services/api';
import PropTypes from 'prop-types';

/**
 * Travel component for managing and displaying travel listings
 */
export const Travel = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    date: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    maxParticipants: 0,
    type: 'business'
  });
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreateListing, setShowCreateListing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await travelApi.getListings();
      setListings(res.data);
      setFilteredListings(res.data);
    } catch (err) {
      setError('Failed to load travel listings.');
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...listings];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedFilters.location) {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
      );
    }
    
    if (selectedFilters.date) {
      const filterDate = new Date(selectedFilters.date);
      filtered = filtered.filter(listing => {
        const startDate = new Date(listing.startDate);
        return startDate >= filterDate;
      });
    }
    
    if (selectedFilters.type) {
      filtered = filtered.filter(listing => listing.type === selectedFilters.type);
    }
    
    setFilteredListings(filtered);
  }, [searchQuery, selectedFilters, listings]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      location: '',
      date: '',
      type: ''
    });
    setSearchQuery('');
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await travelApi.createListing(newListing);
      setListings(prev => [res.data, ...prev]);
      setShowCreateModal(false);
      setNewListing({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        maxParticipants: 0,
        type: 'business'
      });
    } catch (err) {
      setError('Failed to create travel listing.');
    }
    setLoading(false);
  };

  const handleJoinTrip = async (listingId) => {
    setLoading(true);
    setError('');
    try {
      await travelApi.joinTrip(listingId);
      // Refresh listings to get updated participant count
      await fetchListings();
    } catch (err) {
      setError('Failed to join trip.');
    }
    setLoading(false);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5" />;
      case 'train':
        return <Train className="w-5 h-5" />;
      case 'road':
        return <Car className="w-5 h-5" />;
      case 'cruise':
        return <Ship className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
  };

  if (loading && !listings.length) return <div>Loading travel listings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Connect</h1>
            <p className="text-gray-600 mt-1">Find travel companions and join group adventures</p>
          </div>
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
            aria-label="Create new travel listing"
          >
            Create Listing
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search destinations or trips..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search destinations or trips"
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by travel type"
            >
              <option value="all">All Types</option>
              <option value="flight">Flights</option>
              <option value="train">Train</option>
              <option value="road">Road Trip</option>
              <option value="cruise">Cruise</option>
            </select>
          </div>
          <div>
            <button
              className="w-full px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
              aria-label="Filter options"
              onClick={() => {
                // Implement advanced filter modal
                console.log('Advanced filters clicked');
              }}
            >
              <Filter className="w-5 h-5" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.end}
              min={dateRange.start}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
        </div>

        {/* Travel Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <div
              key={listing._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleListingClick(listing)}
            >
              <div className="relative h-48">
                <img
                  src={listing.image || '/default-image.png'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 px-3 py-1 rounded-full flex items-center gap-2">
                    {getTypeIcon(listing.type)}
                    <span className="text-sm font-medium capitalize">{listing.type}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={listing.organizer.avatar}
                    alt={listing.organizer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900">{listing.organizer.name}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(listing.startDate).toLocaleDateString()} - {new Date(listing.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{listing.participants.length}/{listing.maxParticipants} participants</span>
                  </div>
                </div>
                <button
                  className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors ${
                    listing.participants.length >= listing.maxParticipants
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinTrip(listing._id);
                  }}
                  disabled={listing.participants.length >= listing.maxParticipants}
                  aria-label={`Join ${listing.title}`}
                >
                  {listing.participants.length >= listing.maxParticipants ? 'Trip Full' : 'Join Trip'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No travel listings found matching your criteria.</p>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Trip</h2>
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input
                    type="text"
                    value={newListing.title}
                    onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newListing.description}
                    onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    type="text"
                    value={newListing.location}
                    onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={newListing.startDate}
                      onChange={(e) => setNewListing(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <Input
                      type="date"
                      value={newListing.endDate}
                      onChange={(e) => setNewListing(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <Input
                    type="number"
                    value={newListing.maxParticipants}
                    onChange={(e) => setNewListing(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newListing.type}
                    onChange={(e) => setNewListing(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="business">Business</option>
                    <option value="leisure">Leisure</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Create Trip
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Travel.propTypes = {
  // Add any necessary prop types here
}; 