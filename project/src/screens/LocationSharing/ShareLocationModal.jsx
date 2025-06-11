import React, { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const ShareLocationModal = ({
  isOpen,
  onClose,
  onShare,
  currentLocation,
  contacts = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filteredContacts = useMemo(
    () =>
      contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [contacts, searchQuery]
  );

  if (!isOpen) return null;

  const toggleContact = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    onShare(Array.from(selectedIds));
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Share Location</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {currentLocation ? (
          <div className="bg-blue-50 p-3 rounded-xl mb-4 text-sm text-gray-600">
            <p>Your current location:</p>
            <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
            <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
            {currentLocation.city && <p>City: {currentLocation.city}</p>}
            {currentLocation.country && <p>Country: {currentLocation.country}</p>}
          </div>
        ) : (
          <div className="bg-red-50 p-3 rounded-xl mb-4 text-sm text-red-600">
            <p>Location sharing is not active. Please start sharing your location first.</p>
          </div>
        )}

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-80 overflow-y-auto mb-4">
          {filteredContacts.length > 0 ? (
            <div className="space-y-2">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedIds.has(contact.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleContact(contact.id)}
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="flex-1 font-medium text-gray-900">{contact.name}</span>
                  {selectedIds.has(contact.id) && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No contacts found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={selectedIds.size === 0 || !currentLocation}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Share with {selectedIds.size} {selectedIds.size === 1 ? 'contact' : 'contacts'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 