import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Video, MoreHorizontal, ThumbsUp, Smile, PaperclipIcon, Image, Send, Link as LinkIcon } from 'lucide-react';

export const Messages = () => {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(1);
  const [expandedSection, setExpandedSection] = useState('media');
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Smithy Weber',
      avatar: 'https://i.pravatar.cc/300?img=8',
      lastMessage: 'Hello how are you doing?',
      time: '09:28 PM',
      online: true,
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Smithy Weber',
          content: 'Hello how are you doing?',
          timestamp: 'February 16th, 2022',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=8',
        },
        {
          id: 2,
          sender: 'Katie Pena',
          content: 'Hi Smithy, I am doing well. Thanks you.',
          timestamp: 'Today 11:52',
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        },
        {
          id: 3,
          sender: 'Katie Pena',
          content: 'Yes, these all is my own work but mostly is project from Designspace',
          timestamp: 'Today 01:05',
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        },
        {
          id: 4,
          sender: 'Smithy Weber',
          content: '👍',
          timestamp: 'Today 11:52',
          isCurrentUser: false, 
          avatar: 'https://i.pravatar.cc/300?img=8',
        },
        {
          id: 5,
          sender: 'Smithy Weber',
          content: 'Wow! you are awesome man',
          timestamp: 'Today 11:52',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=8',
        },
      ]
    },
    {
      id: 2,
      name: 'Lucas West',
      avatar: 'https://i.pravatar.cc/300?img=3',
      lastMessage: 'I am happy to hear that',
      time: '09:28 PM',
      online: false,
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'Lucas West',
          content: "Hey there, how's the project coming along?",
          timestamp: 'Yesterday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=3',
        },
        {
          id: 2,
          sender: 'Katie Pena',
          content: "It's going really well! Just finishing the final touches.",
          timestamp: 'Yesterday',
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        },
        {
          id: 3,
          sender: 'Lucas West',
          content: 'I am happy to hear that',
          timestamp: '09:28 PM',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=3',
        },
      ]
    },
    {
      id: 3,
      name: 'Jesus Cooper',
      avatar: 'https://i.pravatar.cc/300?img=4',
      lastMessage: 'lol 😂',
      time: '03:30 PM',
      online: false,
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Jesus Cooper',
          content: 'Did you see that meme I sent?',
          timestamp: '03:29 PM',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=4',
        },
        {
          id: 2,
          sender: 'Katie Pena',
          content: 'Yes, it was hilarious!',
          timestamp: '03:30 PM',
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        },
        {
          id: 3,
          sender: 'Jesus Cooper',
          content: 'lol 😂',
          timestamp: '03:30 PM',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=4',
        },
      ]
    },
    {
      id: 4,
      name: 'Joshua Hunt',
      avatar: 'https://i.pravatar.cc/300?img=5',
      lastMessage: 'Yes, exactly',
      time: 'Friday',
      online: false,
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'Joshua Hunt',
          content: 'Are we using Tailwind for styling?',
          timestamp: 'Friday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=5',
        },
        {
          id: 2,
          sender: 'Katie Pena',
          content: 'Yes, it makes development so much faster',
          timestamp: 'Friday',
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        },
        {
          id: 3,
          sender: 'Joshua Hunt',
          content: 'Yes, exactly',
          timestamp: 'Friday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=5',
        },
      ]
    },
    {
      id: 5,
      name: 'Danny Moore',
      avatar: 'https://i.pravatar.cc/300?img=6',
      lastMessage: 'This "One of the perks of...',
      time: 'yesterday',
      online: false,
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Danny Moore',
          content: 'This "One of the perks of working remotely is the flexibility',
          timestamp: 'yesterday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=6',
        },
      ]
    },
    {
      id: 6,
      name: 'Allen Anderson',
      avatar: 'https://i.pravatar.cc/300?img=7',
      lastMessage: 'Hi man, how are you today?',
      time: 'yesterday',
      online: false,
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'Allen Anderson',
          content: 'Hi man, how are you today?',
          timestamp: 'yesterday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=7',
        },
      ]
    },
    {
      id: 7,
      name: 'Martyn Mier',
      avatar: 'https://i.pravatar.cc/300?img=9',
      lastMessage: 'Okay thanks a lot',
      time: 'Friday',
      online: false,
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Martyn Mier',
          content: 'Okay thanks a lot',
          timestamp: 'Friday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=9',
        },
      ]
    },
    {
      id: 8,
      name: 'Anna Ananda',
      avatar: 'https://i.pravatar.cc/300?img=10',
      lastMessage: '😃😃😃',
      time: 'yesterday',
      online: false,
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Anna Ananda',
          content: '😃😃😃',
          timestamp: 'yesterday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=10',
        },
      ]
    },
    {
      id: 9,
      name: 'Salsabila',
      avatar: 'https://i.pravatar.cc/300?img=11',
      lastMessage: 'love it man',
      time: 'Tuesday',
      online: false,
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Salsabila',
          content: 'love it man',
          timestamp: 'Tuesday',
          isCurrentUser: false,
          avatar: 'https://i.pravatar.cc/300?img=11',
        },
      ]
    },
  ]);

  const messagesEndRef = useRef(null);

  const currentChat = chats.find((chat) => chat.id === activeChat);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

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

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        const newMessage = {
          id: chat.messages.length + 1,
          sender: 'Katie Pena',
          content: message,
          timestamp: formatTimestamp(),
          isCurrentUser: true,
          avatar: 'https://i.pravatar.cc/300?img=12',
        };
        
        return {
          ...chat,
          lastMessage: message,
          time: 'Just now',
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markAsRead = (chatId) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, unread: false } : chat
    ));
  };

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    markAsRead(chatId);
  };

  const handleSendEmoji = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
  };

  const sendThumbsUp = () => {
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
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
    
    setChats(updatedChats);
  };

  const filteredChats = searchQuery 
    ? chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Chat Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col h-screen">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <div className="flex gap-2">
            <button 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                activeChat === chat.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleChatClick(chat.id)}
            >
              <div className="relative mr-3">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h2>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex items-center">
                  <p className={`text-sm truncate ${chat.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <img
                    src={currentChat.avatar}
                    alt={currentChat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {currentChat.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900">{currentChat.name}</h2>
                  <p className="text-xs text-gray-500">{currentChat.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  aria-label="Phone call"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  aria-label="Video call"
                >
                  <Video className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="max-w-3xl mx-auto">
                {currentChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-6 flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.isCurrentUser && (
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="w-10 h-10 rounded-full mr-3 self-end"
                      />
                    )}
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.content === '👍' ? (
                        <span className="text-3xl">👍</span>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                    {msg.isCurrentUser && (
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="w-10 h-10 rounded-full ml-3 self-end"
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a message..."
                    className="w-full bg-gray-100 rounded-full py-3 px-4 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Add emoji"
                      onClick={() => handleSendEmoji('😊')}
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {message.trim() ? (
                  <button
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    onClick={handleSendMessage}
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    onClick={sendThumbsUp}
                    aria-label="Send thumbs up"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Profile and Settings */}
      <div className="w-80 bg-white border-l border-gray-100 flex flex-col h-screen">
        {currentChat && (
          <>
            {/* User Profile */}
            <div className="p-6 flex flex-col items-center border-b border-gray-100">
              <img
                src={currentChat.avatar}
                alt={currentChat.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-medium text-gray-900">{currentChat.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{currentChat.online ? 'Online' : 'Offline'}</p>
              
              <div className="mt-6 w-full">
                <button
                  className="w-full py-2 px-4 rounded-lg text-gray-700 font-medium hover:bg-gray-50 border border-gray-200 flex items-center justify-center gap-2"
                >
                  Customize Chat
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto">
              {/* Media, Files and Links */}
              <div className="border-b border-gray-100">
                <button
                  className="p-4 w-full text-left text-sm font-medium text-gray-700 flex items-center justify-between"
                  onClick={() => toggleSection('media')}
                >
                  <span>Media, files and links</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      expandedSection === 'media' ? 'transform rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {expandedSection === 'media' && (
                  <div className="px-4 pb-4">
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Media
                    </button>
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <PaperclipIcon className="w-5 h-5" />
                      Files
                    </button>
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      Links
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy & Support */}
              <div className="border-b border-gray-100">
                <button
                  className="p-4 w-full text-left text-sm font-medium text-gray-700 flex items-center justify-between"
                  onClick={() => toggleSection('privacy')}
                >
                  <span>Privacy & Support</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      expandedSection === 'privacy' ? 'transform rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {expandedSection === 'privacy' && (
                  <div className="px-4 pb-4">
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      Mute notifications
                    </button>
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      Ignore message
                    </button>
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      Block
                    </button>
                    <button className="w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 