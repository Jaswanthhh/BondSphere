import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock, Globe, MessageCircle, Share2, BookmarkPlus, Info, Star } from 'lucide-react';

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

interface TravelDetailsProps {
  listing: TravelListing;
  onBack: () => void;
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const TravelDetails: React.FC<TravelDetailsProps> = ({ listing, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'reviews'>('overview');
  const [message, setMessage] = useState('');

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Emma Wilson',
      userAvatar: 'https://i.pravatar.cc/150?img=6',
      rating: 5,
      comment: 'Amazing experience! The organizer was very professional and the group was fantastic.',
      date: '2 weeks ago'
    },
    {
      id: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://i.pravatar.cc/150?img=7',
      rating: 4,
      comment: 'Great trip overall. Well organized and good company.',
      date: '1 month ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{listing.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Share trip"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Save trip"
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-80 bg-gray-200 relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Show overview"
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('participants')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'participants'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Show participants"
                  >
                    Participants
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Show reviews"
                  >
                    Reviews
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">About this trip</h2>
                      <p className="text-gray-600">{listing.description}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Duration</p>
                          <p>{Math.ceil((new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Globe className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Destinations</p>
                          <p>{listing.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Info className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Important Information</p>
                          <ul className="list-disc list-inside">
                            <li>Travel insurance required</li>
                            <li>Passport must be valid for 6 months</li>
                            <li>Moderate fitness level recommended</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'participants' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Participants</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: listing.currentParticipants }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                          <img
                            src={`https://i.pravatar.cc/150?img=${index + 10}`}
                            alt="Participant"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Traveler {index + 1}</p>
                            <p className="text-sm text-gray-500">Joined 2 days ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Reviews</h2>
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{review.userName}</p>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  index < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={listing.organizer.avatar}
                  alt={listing.organizer.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{listing.organizer.name}</p>
                  <p className="text-sm text-gray-500">Trip Organizer</p>
                </div>
              </div>

              <div className="space-y-4">
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

              <div className="pt-4 border-t border-gray-100">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
                  aria-label={`Join ${listing.title}`}
                >
                  Join Trip
                </button>
                <button
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  aria-label="Message organizer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Organizer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 