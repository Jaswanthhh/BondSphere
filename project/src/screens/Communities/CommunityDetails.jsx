import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { communities as communitiesApi, communityChatApi } from '../../services/api';
import { Send, Users, MessageCircle } from 'lucide-react';

export const CommunityDetails = () => {
  const { id: communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCommunity();
    fetchChatMessages();
    fetchMembers();
    // eslint-disable-next-line
  }, [communityId]);

  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const res = await communitiesApi.getOne(communityId);
      setCommunity(res.data);
      console.log('community', res.data);
    } catch (err) {
      setCommunity(null);
      console.log('community error', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await communityChatApi.getMessages(communityId);
      setChatMessages(res.data);
      console.log('chatMessages', res.data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setChatMessages([]);
      console.log('chatMessages error', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await communitiesApi.getMembers(communityId);
      setMembers(res.data);
      console.log('members', res.data);
    } catch (err) {
      setMembers([]);
      console.log('members error', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setSending(true);
    try {
      await communityChatApi.sendMessage(communityId, chatInput);
      setChatInput('');
      fetchChatMessages();
    } catch (err) {
      // Optionally show error
    } finally {
      setSending(false);
    }
  };

  console.log('loading', loading, 'community', community, 'members', members, 'chatMessages', chatMessages);
  if (loading) return <div className="p-8">Loading...</div>;
  if (!community) return <div className="p-8 text-red-500">Community not found or you do not have access.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Community Info */}
        <div className="flex-1">
          <img src={community?.image || '/default-community.png'} alt={community?.name || 'Community'} className="w-full h-56 object-cover rounded-xl mb-4" />
          <h1 className="text-3xl font-bold mb-2">{community?.name || 'Community Name'}</h1>
          <p className="text-gray-600 mb-4">{community?.description || 'No description available.'}</p>
          <div className="flex items-center gap-4 text-gray-500 mb-2">
            <Users className="w-5 h-5" />
            <span>{community?.members?.length || 0} members</span>
            <span className="ml-4">Category: {community?.category || 'N/A'}</span>
            <span className="ml-4">Type: {community?.type || 'N/A'}</span>
          </div>
        </div>
        {/* Members List */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Members</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(Array.isArray(members) && members.length === 0) ? (
              <div className="text-gray-400">No members yet.</div>
            ) : (
              (members || []).map((member) => (
                <div key={member._id} className="flex items-center gap-2">
                  <img src={member.avatar || '/default-avatar.png'} alt={member.fullName || member.name} className="w-8 h-8 rounded-full" />
                  <span>{member.fullName || member.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Chat Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Community Chat</h2>
        <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
          {(Array.isArray(chatMessages) && chatMessages.length === 0) ? (
            <div className="text-gray-400">No messages yet. Start the conversation!</div>
          ) : (
            (chatMessages || []).map((msg) => (
              <div key={msg._id} className="flex items-start gap-3">
                <img src={msg.sender?.avatar || '/default-avatar.png'} alt={msg.sender?.fullName || 'User'} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-medium">{msg.sender?.fullName || 'User'}</div>
                  <div className="text-gray-700">{msg.content}</div>
                  <div className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700"
            disabled={sending || !chatInput.trim()}
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}; 