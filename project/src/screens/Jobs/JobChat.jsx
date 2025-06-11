import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Search, Phone, Video } from 'lucide-react';
import { chatApi } from '../../services/api';

export const JobChat = ({ onClose }) => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoadingContacts(true);
      setError('');
      try {
        const res = await chatApi.getContacts();
        console.log('chat contacts data:', res.data);
        setContacts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load chat contacts.');
      }
      setLoadingContacts(false);
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        setError('');
        try {
          const res = await chatApi.getMessages(selectedContact.id);
          console.log('chat messages data:', res.data);
          setMessages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          setError('Failed to load messages.');
          setMessages([]);
        }
        setLoadingMessages(false);
      };
      fetchMessages();
    }
  }, [selectedContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedContact) return;
    try {
      const res = await chatApi.sendMessage(selectedContact.id, newMessage);
      setMessages(prevMessages => [...(Array.isArray(prevMessages) ? prevMessages : []), res.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    (contact?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed right-4 bottom-4 w-[480px] h-[700px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold">Job Network Chat</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
          title="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts"
                className="w-full pl-8 pr-2 py-2 border rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="text-center text-gray-500 py-8">Loading contacts...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No contacts found</div>
            ) : (
              filteredContacts.map(contact => (
                <button
                  key={contact.id || contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-3 flex items-center space-x-3 hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-gray-50' : ''
                  }`}
                  title={`Chat with ${contact.name}`}
                >
                  <div className="relative">
                    <img
                      src={contact?.avatar || '/default-avatar.png'}
                      alt={contact?.name || 'Contact'}
                      className="w-10 h-10 rounded-full"
                    />
                    {contact?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{contact?.name || 'Unknown Contact'}</div>
                    <div className="text-sm text-gray-500">{contact?.role || 'No Role'}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-3 border-b flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{selectedContact.name}</div>
                    <div className="text-sm text-gray-500">{selectedContact.company}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Start voice call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Start video call"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="text-center text-gray-500 py-8">Loading messages...</div>
                ) : error ? (
                  <div className="text-center text-red-500 py-8">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No messages yet</div>
                ) : (
                  (Array.isArray(messages) ? messages : []).map(message => (
                    <div
                      key={message.id || message._id}
                      className={`flex mb-4 ${
                        message?.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message?.senderId === 'currentUser'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        {message?.content || ''}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 