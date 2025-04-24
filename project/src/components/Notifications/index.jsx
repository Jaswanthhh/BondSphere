import React from 'react';
import { X, Bell, UserPlus, MessageSquare, Heart } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'connection',
    icon: UserPlus,
    message: 'John Doe sent you a connection request',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'message',
    icon: MessageSquare,
    message: 'New message from Sarah Smith',
    time: '5 minutes ago'
  },
  {
    id: 3,
    type: 'like',
    icon: Heart,
    message: 'Alex Johnson liked your post',
    time: '10 minutes ago'
  }
];

export const Notifications = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-lg p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {notifications.map(({ id, type, icon: Icon, message, time }) => (
            <div
              key={id}
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              <div className={`p-2 rounded-full ${
                type === 'connection' ? 'bg-blue-100 text-blue-500' :
                type === 'message' ? 'bg-green-100 text-green-500' :
                'bg-pink-100 text-pink-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{message}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 