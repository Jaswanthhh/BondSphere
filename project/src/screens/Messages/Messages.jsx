import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Video, MoreHorizontal, ThumbsUp, Smile, PaperclipIcon, Image, Send, Link as LinkIcon, MoreVertical } from 'lucide-react';
import api, { users as usersApi } from '../../services/api';
import io from 'socket.io-client';
import { messagesApi } from '../../services/api';
import { API_BASE_URL } from '../../config';

export const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(1);
  const [expandedSection, setExpandedSection] = useState('media');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const socket = useRef(null);

  // Get current user ID from localStorage
  const [currentUserId, setCurrentUserId] = useState(null);
  useEffect(() => {
    const id = localStorage.getItem('userId');
    setCurrentUserId(id);
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await usersApi.getFriends();
      setFriends(res.data);
    } catch (err) {
      setError('Failed to load friends');
    }
  };
  
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      const res = await messagesApi.getConversations();
      setConversations(res.data);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await messagesApi.getMessages(userId);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedMedia) return;

    try {
      const formData = new FormData();
      formData.append('receiverId', selectedUser._id);
      formData.append('content', newMessage);
      if (selectedMedia) {
        formData.append('media', selectedMedia);
      }

      const res = await messagesApi.sendMessage(formData);
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      setSelectedMedia(null);
      scrollToBottom();
      fetchFriends();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `Today ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const markAsRead = (chatId) => {
    setConversations(conversations.map(chat => 
      chat.user._id === chatId ? { ...chat, unread: false } : chat
    ));
  };

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    markAsRead(chatId);
  };

  const handleSendEmoji = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji);
  };

  const sendThumbsUp = () => {
    const updatedConversations = conversations.map(chat => {
      if (chat.user._id === activeChat) {
        const newMessage = {
          id: chat.messages.length + 1,
          sender: 'Katie Pena',
          content: '👍',
          timestamp: formatTimestamp(),
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        };
        
        return {
          ...chat,
          lastMessage: '👍',
          time: 'Just now',
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });
    
    setConversations(updatedConversations);
  };

  // Merge friends and conversations for sidebar, only for current user
  const allContacts = [
    ...friends.filter(f => f._id !== currentUserId && !conversations.some(c => c.user._id === f._id)),
    ...conversations
      .filter(c => c.user._id !== currentUserId)
      .map(c => c.user)
  ];

  const filteredContacts = searchQuery
    ? allContacts.filter(contact =>
        (contact.fullName || contact.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allContacts;

  useEffect(() => {
    // Socket.IO real-time connection
    socket.current = io('http://localhost:5000'); // Change to your backend URL if needed
    socket.current.emit('joinRoom', selectedUser?._id);
    socket.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.current.disconnect();
    };
  }, [selectedUser]);

  // Refresh friends list when window/tab regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchFriends();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // When a contact is selected, fetch only messages between current user and that contact
  const handleSelectUser = (contact) => {
    setSelectedUser(contact);
    setMessages([]); // Clear previous messages for privacy
    fetchMessages(contact._id); // Fetch only messages with this user
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedUser && selectedUser._id === contact._id ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSelectUser(contact)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar ? (contact.avatar.startsWith('http') ? contact.avatar : `${API_BASE_URL}${contact.avatar}`) : '/default-avatar.png'}
                    alt={contact.fullName || contact.username || contact.email || 'User'}
                    className="w-12 h-12 rounded-full"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{contact.fullName || contact.username || contact.email || 'User'}</h3>
                    {contact.username && (
                      <p className="text-sm text-gray-500">@{contact.username}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar ? (selectedUser.avatar.startsWith('http') ? selectedUser.avatar : `${API_BASE_URL}${selectedUser.avatar}`) : '/default-avatar.png'}
                  alt={selectedUser.fullName || selectedUser.username || selectedUser.email || 'User'}
                  className="w-10 h-10 rounded-full"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <div>
                  <h3 className="font-medium">{selectedUser.fullName || selectedUser.username || selectedUser.email || 'User'}</h3>
                  {selectedUser.username && (
                    <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                  )}
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender && message.sender._id === selectedUser._id ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender && message.sender._id === selectedUser._id
                          ? 'bg-gray-100'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {message.media && (
                        <div className="mb-2">
                          {message.media.type?.startsWith('image/') ? (
                            <img
                              src={message.media.url}
                              alt="Message media"
                              className="rounded-lg max-w-full"
                            />
                          ) : (
                            <video
                              src={message.media.url}
                              controls
                              className="rounded-lg max-w-full"
                            />
                          )}
                        </div>
                      )}
                      <p>{message.content || ''}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                  <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}; 