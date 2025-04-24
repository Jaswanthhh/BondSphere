import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Image as ImageIcon,
  MessageCircle,
  Heart,
  Share2,
  Shield,
  Lock,
  Settings,
  Bell,
  Calendar,
  BookOpen,
  Grid3X3,
  UserPlus,
  Info
} from 'lucide-react';

export const CommunityDetails = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const [activeTab, setActiveTab] = useState('about');

  // In a real app, you would fetch this data based on the communityId
  const community = {
    id: communityId,
    name: 'Tech Innovators Hub',
    description: 'A verified community for professional tech innovators. Requires work email verification.',
    members: 1200,
    category: 'tech',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    type: 'verified',
    isJoined: false,
    verificationRequirements: [
      'Must have a valid work email from a tech company',
      'Must have at least 2 years of professional experience',
      'LinkedIn profile verification required'
    ]
  };

  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'media', label: 'Media', icon: Grid3X3 }
  ];

  const handleBack = () => {
    navigate(`/home/communities/${communityId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold">{community.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {community.type === 'verified' && (
                <div className="flex items-center text-green-600">
                  <Shield className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
              {community.type === 'private' && (
                <div className="flex items-center text-purple-600">
                  <Lock className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Private</span>
                </div>
              )}
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={community.image}
                alt={community.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{community.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{community.members.toLocaleString()} members</span>
                </div>
              </div>
            </div>
            {!community.isJoined && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Join Community
              </button>
            )}
          </div>
          <p className="mt-4 text-gray-600">{community.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-3 py-4 text-sm font-medium border-b-2 
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">About this Community</h3>
            <div className="space-y-4">
              <p className="text-gray-600">{community.description}</p>
              {community.type === 'verified' && community.verificationRequirements && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Verification Requirements</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {community.verificationRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Community Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Member cards will be added here */}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {/* Event cards will be added here */}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Media Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Media grid will be added here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 