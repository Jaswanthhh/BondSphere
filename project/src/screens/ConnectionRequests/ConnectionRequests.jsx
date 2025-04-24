import React, { useState } from 'react';
import { UserPlus, X, Check, MessageCircle } from 'lucide-react';

export const ConnectionRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: '1',
      user: {
        name: 'John Doe',
        role: 'Senior Software Engineer',
        company: 'Tech Corp',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      message: 'I noticed we both work in the AI space. Would love to connect and share insights!',
      timestamp: new Date()
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        role: 'Product Manager',
        company: 'Innovate Inc',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      message: 'Your work on React patterns is impressive! Would be great to connect and learn more.',
      timestamp: new Date()
    }
  ]);

  const handleAccept = (requestId) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // Here you would typically make an API call to accept the connection
  };

  const handleDecline = (requestId) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // Here you would typically make an API call to decline the connection
  };

  const handleMessage = (requestId) => {
    // Here you would typically navigate to a chat with the user
    console.log('Navigate to chat with request:', requestId);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-semibold text-gray-900">Connection Requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending connection requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <img
                  src={request.user.avatar}
                  alt={request.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.user.name}</h3>
                      <p className="text-sm text-gray-500">
                        {request.user.role} at {request.user.company}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMessage(request.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Send message"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Accept request"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Decline request"
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{request.message}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    {request.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 