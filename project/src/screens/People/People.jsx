import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X, Users } from 'lucide-react';
import { users as usersApi } from '../../services/api';
import { toast } from 'react-hot-toast';

export const People = () => {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user id from localStorage or API
    const id = localStorage.getItem('userId');
    setCurrentUserId(id);
    fetchData();
  }, []);

  // Add debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async (query = '') => {
    try {
      const res = await usersApi.getAllUsers(query);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, requestsRes, friendsRes] = await Promise.all([
        usersApi.getAllUsers(),
        usersApi.getFriendRequests(),
        usersApi.getFriends()
      ]);
      setUsers(usersRes.data);
      setFriendRequests(requestsRes.data);
      setFriends(friendsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await usersApi.sendFriendRequest(userId);
      toast.success('Friend request sent');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await usersApi.acceptFriendRequest(userId);
      toast.success('Friend request accepted');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await usersApi.rejectFriendRequest(userId);
      toast.success('Friend request rejected');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject friend request');
    }
  };

  // Defensive: never show yourself in the discover list
  const filteredUsers = users.filter(user =>
    user._id !== currentUserId && (
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">People</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('discover')}
                className={`${
                  activeTab === 'discover'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Friend Requests
                {friendRequests.received.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                    {friendRequests.received.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`${
                  activeTab === 'friends'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Friends
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'discover' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(user => (
                  <div key={user._id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.fullName}
                        className="h-12 w-12 rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                        {user.location && (
                          <p className="text-xs text-gray-400">{user.location}</p>
                        )}
                      </div>
                    </div>
                    {/* Defensive button logic */}
                    {user.isFriend ? (
                      <span className="text-sm text-green-600">Friends</span>
                    ) : user.hasSentRequest ? (
                      <span className="text-sm text-gray-500">Request Sent</span>
                    ) : user.hasReceivedRequest ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(user._id)}
                          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(user._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(user._id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Received Requests</h3>
                  {friendRequests.received.length === 0 ? (
                    <p className="text-gray-500">No pending friend requests</p>
                  ) : (
                    <div className="space-y-4">
                      {friendRequests.received.map(user => (
                        <div key={user._id} className="flex items-center justify-between bg-white border rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || '/default-avatar.png'}
                              alt={user.fullName}
                              className="h-12 w-12 rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptRequest(user._id)}
                              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(user._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sent Requests</h3>
                  {friendRequests.sent.length === 0 ? (
                    <p className="text-gray-500">No sent friend requests</p>
                  ) : (
                    <div className="space-y-4">
                      {friendRequests.sent.map(user => (
                        <div key={user._id} className="flex items-center justify-between bg-white border rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || '/default-avatar.png'}
                              alt={user.fullName}
                              className="h-12 w-12 rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">Pending</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.length === 0 ? (
                  <p className="text-gray-500">No friends yet</p>
                ) : (
                  friends.map(user => (
                    <div key={user._id} className="bg-white border rounded-lg p-4 flex items-center space-x-3">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.fullName}
                        className="h-12 w-12 rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                        {user.location && (
                          <p className="text-xs text-gray-400">{user.location}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 