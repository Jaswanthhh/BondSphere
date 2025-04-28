import React, { useState } from 'react';
import { ArrowLeft, Share2, BookmarkPlus, MapPin, Calendar, Users, Clock, Globe, Info, MessageCircle, Shield, Bell } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { SecurityVerification } from '../../components/SecurityVerification';
import { SecurityNotification } from '../../components/SecurityNotification';

export const TravelDetails = ({ listing }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const [securityNotification, setSecurityNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const handleBack = () => {
    navigate('/home/travel');
  };

  const handleVerificationComplete = (isVerified) => {
    setShowVerification(false);
    if (isVerified) {
      const newNotification = {
        id: Date.now(),
        type: 'success',
        message: 'Your account is now verified and secure!'
      };
      setNotifications(prev => [...prev, newNotification]);
      setSecurityNotification(newNotification);
    }
  };

  const handleCloseNotification = (notificationId) => {
    if (notificationId) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } else {
      setSecurityNotification(null);
    }
  };

  const handleShowNotifications = () => {
    setShowNotificationPanel(!showNotificationPanel);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="relative">
                <button
                  onClick={handleShowNotifications}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative"
                  aria-label="Show notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {/* Notification Panel */}
                {showNotificationPanel && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            {notification.type === 'success' && (
                              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.id).toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCloseNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
        <div className="container mx-auto px-4 py-8">
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

              {/* Security Verification Section */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Security Status</h3>
                  <button
                    onClick={() => setShowVerification(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Verify Now
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Complete verification to ensure a safe travel experience
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Verification increases trust and safety</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Security Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <SecurityVerification 
              onVerificationComplete={handleVerificationComplete} 
              onClose={() => setShowVerification(false)}
            />
          </div>
        </div>
      )}

      {/* Security Notification */}
      {securityNotification && (
        <SecurityNotification
          type={securityNotification.type}
          message={securityNotification.message}
          onClose={() => handleCloseNotification()}
        />
      )}
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