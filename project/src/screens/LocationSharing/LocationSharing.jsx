import React, { useState, useEffect } from 'react';
import { MapPin, Share2, Users, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ShareLocationModal } from './ShareLocationModal';
import { locationApi } from '../../services/api';

export const LocationSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingWith, setSharingWith] = useState([]);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [contactsRes, sharedRes] = await Promise.all([
          locationApi.getContacts(),
          locationApi.getSharedLocations(),
        ]);
        setContacts(contactsRes.data);
        setSharedLocations(sharedRes.data);
      } catch (err) {
        setError('Failed to load contacts or shared locations.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isSharing && currentLocation) {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }
      const interval = window.setInterval(() => {
        updateLocation();
      }, 10000);
      setLocationUpdateInterval(interval);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isSharing, currentLocation]);

  const fetchGeoapifyLocation = async () => {
    const response = await fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=fe56f6247fad4b6c9f15b0816bcd37c4");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to fetch location from Geoapify: ' + errorText);
    }
    const result = await response.json();
    console.log('Geoapify result:', result); // Debug log
    if (!result.location) throw new Error('Geoapify did not return location: ' + JSON.stringify(result));
    return {
      latitude: result.location.latitude,
      longitude: result.location.longitude,
      city: result.city?.name,
      country: result.country?.name,
      timestamp: Date.now(),
    };
  };

  const updateLocation = async () => {
    let newLocation = null;
    try {
      newLocation = await fetchGeoapifyLocation();
      setCurrentLocation(newLocation);
    } catch (err) {
      console.error('Geoapify location fetch error:', err);
      setError(err.message || 'Error updating location from Geoapify.');
      return;
    }
    if (isSharing) {
      try {
        await locationApi.updateLocation(newLocation);
        fetchSharedLocations();
      } catch (err) {
        console.error('Backend update location error:', err);
        setError('Location updated, but failed to update backend: ' + (err.message || err.toString()));
      }
    }
  };

  const fetchSharedLocations = async () => {
    try {
      const sharedRes = await locationApi.getSharedLocations();
      setSharedLocations(sharedRes.data);
    } catch (err) {
      setError('Failed to refresh shared locations.');
    }
  };

  const startSharing = async () => {
    let newLocation = null;
    try {
      newLocation = await fetchGeoapifyLocation();
      setCurrentLocation(newLocation);
      setIsSharing(true);
      setError(null);
    } catch (err) {
      console.error('Geoapify location fetch error:', err);
      setError(err.message || 'Unable to access location from Geoapify.');
      return;
    }
    // Only try backend update if location fetch succeeded
    try {
      await locationApi.updateLocation(newLocation);
      fetchSharedLocations();
    } catch (err) {
      console.error('Backend update location error:', err);
      setError('Location fetched, but failed to update backend: ' + (err.message || err.toString()));
    }
  };

  const stopSharing = () => {
    setIsSharing(false);
    setCurrentLocation(null);
    setSharingWith([]);
    if (locationUpdateInterval) {
      clearInterval(locationUpdateInterval);
      setLocationUpdateInterval(null);
    }
  };

  const handleShareLocation = async (selectedContacts) => {
    setSharingWith(selectedContacts);
    try {
      await locationApi.shareLocation({
        contacts: selectedContacts,
        location: currentLocation,
      });
      fetchSharedLocations();
    } catch (err) {
      setError('Failed to share location.');
    }
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) return <div>Loading location sharing...</div>;
  if (error) return <div className="text-red-500">{error.toString()}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-500" /> Location Sharing
      </h2>
      <div className="mb-4 flex gap-3">
        {!isSharing ? (
          <Button onClick={startSharing}>
            <Share2 className="w-4 h-4 mr-2" /> Start Sharing My Location
          </Button>
        ) : (
          <Button variant="outline" onClick={stopSharing}>
            <X className="w-4 h-4 mr-2" /> Stop Sharing
          </Button>
        )}
        {isSharing && (
          <Button onClick={() => setIsShareModalOpen(true)}>
            <Users className="w-4 h-4 mr-2" /> Share With Contacts
          </Button>
        )}
      </div>
      {isSharing && currentLocation && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Your current location:</span> <br />
            Latitude: {currentLocation.latitude.toFixed(6)}, Longitude: {currentLocation.longitude.toFixed(6)}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold mt-6 mb-2">Shared Locations</h3>
      <div className="space-y-3">
        {sharedLocations.length === 0 ? (
          <div className="text-gray-500">No locations shared yet.</div>
        ) : (
          sharedLocations.map(loc => (
            <div key={loc.userId} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <img src={loc.avatar} alt={loc.userName} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{loc.userName}</div>
                <div className="text-sm text-gray-600">
                  Lat: {loc.location.latitude.toFixed(5)}, Lng: {loc.location.longitude.toFixed(5)}
                </div>
                <div className="text-xs text-gray-400">{formatTimeAgo(loc.location.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <ShareLocationModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShareLocation}
        currentLocation={currentLocation}
        contacts={contacts}
      />
    </div>
  );
} 