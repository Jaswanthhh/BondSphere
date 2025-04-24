import React, { useState } from 'react';
import { ArrowLeft, Share2, BookmarkPlus, MapPin, Calendar, Users, Clock, Globe, Info, MessageCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const TravelDetails = ({ listing }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home/travel');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">European Cultural Tour</h1>
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
      </header>

      {/* Cover Image */}
      <div className="h-[320px] w-full relative">
        <img
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a"
          alt="European Cultural Tour"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <nav className="border-b border-gray-200">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-1 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`px-1 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'participants'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Participants
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-1 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews
                </button>
              </div>
            </nav>

            {/* Tab Content */}
            <div className="py-6">
              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About this trip</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Experience the best of European culture with like-minded travelers. Visit iconic landmarks, enjoy local cuisine, and immerse yourself in the rich history of these beautiful cities. Perfect for culture enthusiasts and photography lovers.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Duration</h3>
                      <p className="text-gray-600">15 days</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Destinations</h3>
                      <p className="text-gray-600">Paris, Rome, Barcelona</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Important Information</h3>
                      <ul className="text-gray-600 space-y-2 mt-1">
                        <li>• Travel insurance required</li>
                        <li>• Passport must be valid for 6 months</li>
                        <li>• Moderate fitness level recommended</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 sticky top-24">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Travel Enthusiasts"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Travel Enthusiasts</h3>
                  <p className="text-sm text-gray-500">Trip Organizer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 shrink-0" />
                  <span>Paris, Rome, Barcelona</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  <span>6/15/2024 - 6/30/2024</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 shrink-0" />
                  <span>8/12 participants</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Join Trip
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message Organizer
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

TravelDetails.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    destination: PropTypes.string,
    maxParticipants: PropTypes.number,
    currentParticipants: PropTypes.number,
    organizer: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    })
  })
};