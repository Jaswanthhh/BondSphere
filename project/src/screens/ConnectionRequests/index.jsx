import React, { useEffect, useState } from 'react';
import { UserPlus, X, Check, Search } from 'lucide-react';
import { connectionRequestsApi } from '../../services/api';

export const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await connectionRequestsApi.getRequests();
        setRequests(res.data);
      } catch (err) {
        setError('Failed to load connection requests.');
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await connectionRequestsApi.acceptRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      setError('Failed to accept request.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await connectionRequestsApi.rejectRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      setError('Failed to reject request.');
    }
  };

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading connection requests...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Connection Requests</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No connection requests found</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  {request.avatar ? (
                    <img
                      src={request.avatar || '/default-avatar.png'}
                      alt={request.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                    />
                  ) : (
                    <span className="text-xl font-semibold text-blue-500">
                      {request.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.name}</h3>
                  <p className="text-sm text-gray-500">{request.role} at {request.company}</p>
                  <p className="text-xs text-blue-500">{request.mutualConnections} mutual connections</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 