import React from 'react';
import { Check, X, Briefcase, MapPin } from 'lucide-react';

interface ConnectionRequest {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  mutualConnections: number;
  message?: string;
  timestamp: string;
}

export const ConnectionRequests = (): JSX.Element => {
  const [requests, setRequests] = React.useState<ConnectionRequest[]>([
    {
      id: 1,
      name: "David Chen",
      role: "Senior Software Engineer",
      company: "Google",
      location: "San Francisco, CA",
      avatar: "https://i.pravatar.cc/150?img=11",
      mutualConnections: 12,
      message: "Hi! I noticed we both work in tech and have similar interests. Would love to connect!",
      timestamp: "2 days ago"
    },
    {
      id: 2,
      name: "Sarah Miller",
      role: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      avatar: "https://i.pravatar.cc/150?img=9",
      mutualConnections: 8,
      timestamp: "3 days ago"
    },
    {
      id: 3,
      name: "James Wilson",
      role: "UX Designer",
      company: "Apple",
      location: "Cupertino, CA",
      avatar: "https://i.pravatar.cc/150?img=7",
      mutualConnections: 15,
      message: "Hello! I'm expanding my professional network in the design space.",
      timestamp: "5 days ago"
    }
  ]);

  const handleAccept = (requestId: number) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // In a real app, you would make an API call here
  };

  const handleReject = (requestId: number) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // In a real app, you would make an API call here
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Network Requests</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          {requests.length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 transition-all">
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

        {requests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending network requests</p>
          </div>
        )}
      </div>
    </div>
  );
}; 