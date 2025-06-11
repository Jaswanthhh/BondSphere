import React, { useEffect, useState } from 'react';
import { Check, X, Briefcase, MapPin } from 'lucide-react';
import { connectionRequestsApi } from '../../services/api';

export const ConnectionRequests = () => {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await connectionRequestsApi.getRequests();
        console.log('connection requests data:', res.data);
        setRequests({
          received: Array.isArray(res.data.received) ? res.data.received : [],
          sent: Array.isArray(res.data.sent) ? res.data.sent : []
        });
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
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (err) {
      setError('Failed to accept request.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await connectionRequestsApi.rejectRequest(requestId);
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (err) {
      setError('Failed to reject request.');
    }
  };

  if (loading) return <div>Loading connection requests...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Network Requests</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          {requests.received.length + requests.sent.length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {(requests.received || []).map((request) => (
          <div key={request.id || request._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{request.name}</h3>
                  <p className="text-gray-600 text-sm">{request.role}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{request.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.location}</span>
                    </div>
                  </div>
                  {request.message && (
                    <p className="mt-3 text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                      {request.message}
                    </p>
                  )}
                  <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                    <span>{request.mutualConnections} mutual connections</span>
                    <span>•</span>
                    <span>{request.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  aria-label="Accept connection request"
                  title="Accept"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Reject connection request"
                  title="Reject"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {requests.received.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending received requests</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {(requests.sent || []).map((request) => (
          <div key={request.id || request._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{request.name}</h3>
                  <p className="text-gray-600 text-sm">{request.role}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{request.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.location}</span>
                    </div>
                  </div>
                  {request.message && (
                    <p className="mt-3 text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                      {request.message}
                    </p>
                  )}
                  <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                    <span>{request.mutualConnections} mutual connections</span>
                    <span>•</span>
                    <span>{request.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  aria-label="Accept connection request"
                  title="Accept"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Reject connection request"
                  title="Reject"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {requests.sent.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending sent requests</p>
          </div>
        )}
      </div>
    </div>
  );
}; 