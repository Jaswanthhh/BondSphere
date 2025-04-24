import React, { useState } from 'react';
import { ArrowLeft, Users, Shield, Lock, UserPlus, Info, Settings, Send, Phone, Video, Smile, Paperclip, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const CommunityHome = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState(null);
  
  // In a real app, you would fetch this data based on the communityId
  const community = {
    id: communityId,
    name: 'Tech Innovators Hub',
    description: 'A verified community for professional tech innovators. Requires work email verification.',
    members: 1200,
    category: 'tech',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    type: 'verified',
    isJoined: false
  };

  const [messages] = useState([
    {
      id: '1',
      userId: 'user1',
      userName: 'Alex Thompson',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Hey everyone! Welcome to our community chat!',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Chen',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      content: 'Thanks for having me here. Looking forward to connecting with everyone!',
      timestamp: '1 hour ago'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Add message handling logic here
    setMessage('');
  };

  const handleStartCall = (type) => {
    setCallType(type);
    setShowCallModal(true);
  };

  const handleBack = () => {
    navigate('/home/communities');
  };

  const handleViewDetails = () => {
    navigate(`/home/communities/${communityId}/details`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{community.name}</h1>
            </div>
            <button
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
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-64 bg-gray-200 relative">
        <img
          src={community.image}
          alt={`${community.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          {community.type === 'verified' && (
            <div className="bg-white/90 px-3 py-1 rounded-full flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Verified Community</span>
            </div>
          )}
          {community.type === 'private' && (
            <div className="bg-white/90 px-3 py-1 rounded-full flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Private Community</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 mb-6">{community.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>{community.members.toLocaleString()} members</span>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleViewDetails}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="View community information"
                >
                  <Info className="w-4 h-4" />
                  <span>Community Info</span>
                </button>
                {community.isJoined && (
                  <>
                    <button
                      onClick={() => handleStartCall('video')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      aria-label="Start video call"
                    >
                      <Video className="w-4 h-4" />
                      <span>Video Call</span>
                    </button>
                    <button
                      onClick={() => handleStartCall('audio')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      aria-label="Start audio call"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Voice Call</span>
                    </button>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      aria-label="Community settings"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'chat'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Show chat"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'about'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Show about"
                  >
                    About
                  </button>
                </div>
              </div>

              {activeTab === 'chat' ? (
                <div className="flex flex-col h-[600px]">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <img
                          src={msg.userAvatar}
                          alt={msg.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{msg.userName}</span>
                            <span className="text-sm text-gray-500">{msg.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mt-1">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full pl-4 pr-12 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Add emoji"
                          >
                            <Smile className="w-5 h-5 text-gray-400" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Attach file"
                          >
                            <Paperclip className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">About this Community</h3>
                  <p className="text-gray-600">{community.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {callType === 'video' ? 'Video Call' : 'Voice Call'}
              </h3>
              <button
                onClick={() => setShowCallModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Starting a {callType === 'video' ? 'video' : 'voice'} call with {community.name}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCallModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Start Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};