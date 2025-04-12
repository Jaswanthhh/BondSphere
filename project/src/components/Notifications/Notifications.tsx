import React from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  type: 'reply' | 'like' | 'follow' | 'post' | 'video';
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
  isUnread: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Notifications = ({ isOpen, onClose }: NotificationsProps): JSX.Element | null => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'reply',
      user: {
        name: 'Stanley Burton',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: 'replied to your post: "Great! Love it ❤️"',
      time: '1 hour ago',
      isUnread: true
    },
    {
      id: 2,
      type: 'like',
      user: {
        name: 'Lucas West',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      content: 'liked your comment',
      time: '2 hours ago',
      isUnread: true
    },
    {
      id: 3,
      type: 'post',
      user: {
        name: '5-Minute Design',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'post a new video: "Your shoes will look so good with these creative DIY hacks!"',
      time: '2 hours ago',
      isUnread: true
    },
    {
      id: 4,
      type: 'follow',
      user: {
        name: 'Michael Joss',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      content: 'started following you',
      time: '2 hours ago',
      isUnread: false
    },
    {
      id: 5,
      type: 'like',
      user: {
        name: 'Lucas West',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      content: 'liked your post "One of the perks of working in an international company is sharing..."',
      time: '2 hours ago',
      isUnread: false
    },
    {
      id: 6,
      type: 'like',
      user: {
        name: 'Jason Gutierrez',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      content: 'liked your post "One of the perks of working in an international company is sharing..."',
      time: '3 hours ago',
      isUnread: false
    },
    {
      id: 7,
      type: 'follow',
      user: {
        name: 'Danny Moore',
        avatar: 'https://i.pravatar.cc/150?img=6'
      },
      content: 'started following you',
      time: '3 hours ago',
      isUnread: false
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Notifications Panel */}
      <div className="relative mt-16 w-full max-w-md bg-white rounded-2xl shadow-lg">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <button 
              className="text-blue-500 text-sm hover:underline"
              onClick={() => {/* Mark all as read */}}
            >
              Mark all read
            </button>
          </div>
          <div className="flex gap-4">
            <button className="text-blue-500 border-b-2 border-blue-500 px-3 py-2">
              All Notification
            </button>
            <button className="text-gray-500 px-3 py-2">
              Unread
            </button>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${
                notification.isUnread ? 'bg-blue-50/50' : ''
              }`}
            >
              <img
                src={notification.user.avatar}
                alt={notification.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">
                  <span className="font-medium">{notification.user.name}</span>{' '}
                  <span className="text-gray-600">{notification.content}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
              </div>
              {notification.isUnread && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 