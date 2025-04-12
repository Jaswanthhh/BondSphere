import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Filter, Plane, Train, Car, Ship, Globe, ArrowRight } from 'lucide-react';
import { TravelDetails } from './TravelDetails';
import { CreateListing } from './CreateListing';

interface TravelListing {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  type: 'flight' | 'train' | 'road' | 'cruise';
  maxParticipants: number;
  currentParticipants: number;
  image: string;
  organizer: {
    name: string;
    avatar: string;
  };
  description: string;
}

export const Travel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'flight' | 'train' | 'road' | 'cruise'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedListing, setSelectedListing] = useState<TravelListing | null>(null);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [travelListings, setTravelListings] = useState<TravelListing[]>([
    {
      id: '1',
      title: 'European Cultural Tour',
      destination: 'Paris, Rome, Barcelona',
      startDate: '2024-06-15',
      endDate: '2024-06-30',
      type: 'flight',
      maxParticipants: 12,
      currentParticipants: 8,
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
      organizer: {
        name: 'Travel Enthusiasts',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      description: 'Experience the best of European culture with like-minded travelers. Visit iconic landmarks, enjoy local cuisine, and immerse yourself in the rich history of these beautiful cities. Perfect for culture enthusiasts and photography lovers.'
    },
    {
      id: '2',
      title: 'Scenic Railway Journey',
      destination: 'Swiss Alps',
      startDate: '2024-07-10',
      endDate: '2024-07-15',
      type: 'train',
      maxParticipants: 20,
      currentParticipants: 12,
      image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722',
      organizer: {
        name: 'Rail Adventures',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      description: 'Journey through breathtaking mountain landscapes by train. Experience the magic of the Swiss Alps with stunning views, comfortable accommodations, and expert guides. Includes scenic stops and optional hiking excursions.'
    },
    {
      id: '3',
      title: 'Mediterranean Cruise',
      destination: 'Greek Islands',
      startDate: '2024-08-01',
      endDate: '2024-08-10',
      type: 'cruise',
      maxParticipants: 30,
      currentParticipants: 22,
      image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19',
      organizer: {
        name: 'Ocean Voyages',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      description: 'Explore the beautiful Greek Islands on a luxury cruise. Visit multiple islands, enjoy water activities, and experience the best of Mediterranean cuisine. Perfect for those seeking a blend of relaxation and adventure.'
    }
  ]);

  const getTypeIcon = (type: TravelListing['type']) => {
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

  const handleListingClick = (listing: TravelListing) => {
    setSelectedListing(listing);
  };

  const handleCreateListing = (newListing: Omit<TravelListing, 'id' | 'currentParticipants' | 'organizer'>) => {
    const listing: TravelListing = {
      ...newListing,
      id: Date.now().toString(),
      currentParticipants: 0,
      organizer: {
        name: 'Current User', // Replace with actual user data
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    };
    setTravelListings([listing, ...travelListings]);
    setShowCreateListing(false);
  };

  const handleJoinTrip = (listingId: string) => {
    setTravelListings(travelListings.map(listing => {
      if (listing.id === listingId && listing.currentParticipants < listing.maxParticipants) {
        return {
          ...listing,
          currentParticipants: listing.currentParticipants + 1
        };
      }
      return listing;
    }));
  };

  const filteredListings = travelListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || listing.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (selectedListing) {
    return (
      <TravelDetails
        listing={selectedListing}
        onBack={() => setSelectedListing(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Connect</h1>
            <p className="text-gray-600 mt-1">Find travel companions and join group adventures</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => setShowCreateListing(true)}
            aria-label="Create new travel listing"
          >
            Create Listing
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations or trips..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search destinations or trips"
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
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
            >
              <Filter className="w-5 h-5" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Travel Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <div
              key={listing.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleListingClick(listing)}
            >
              <div className="relative h-48">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
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
                    <span>{listing.destination}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(listing.startDate).toLocaleDateString()} - {new Date(listing.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{listing.currentParticipants}/{listing.maxParticipants} participants</span>
                  </div>
                </div>
                <button
                  className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors ${
                    listing.currentParticipants >= listing.maxParticipants
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinTrip(listing.id);
                  }}
                  disabled={listing.currentParticipants >= listing.maxParticipants}
                  aria-label={`Join ${listing.title}`}
                >
                  {listing.currentParticipants >= listing.maxParticipants ? 'Trip Full' : 'Join Trip'}
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

        {showCreateListing && (
          <CreateListing
            onClose={() => setShowCreateListing(false)}
            onSubmit={handleCreateListing}
          />
        )}
      </div>
    </div>
  );
}; 