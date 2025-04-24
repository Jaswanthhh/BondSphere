import React, { useState, useEffect } from 'react';
import { ShareLocationModal } from './ShareLocationModal';
import { LocationMap } from './LocationMap';
import { Button } from './ui/button';
import { Share2, StopCircle } from 'lucide-react';

export const LocationSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [watchId, setWatchId] = useState(null);

  // Mock contacts for demonstration
  const contacts = [
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  const startSharing = (selectedContacts) => {
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            id: 'current-user',
            name: 'You',
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            lastUpdated: new Date(),
          };

          setSharedLocations((prev) => {
            const filtered = prev.filter((loc) => loc.id !== 'current-user');
            return [...filtered, newLocation];
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          stopSharing();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      setWatchId(id);
      setIsSharing(true);
      setIsModalOpen(false);
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    setSharedLocations((prev) => prev.filter((loc) => loc.id !== 'current-user'));
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Location Sharing</h2>
        {!isSharing ? (
          <Button onClick={() => setIsModalOpen(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Location
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopSharing}>
            <StopCircle className="w-4 h-4 mr-2" />
            Stop Sharing
          </Button>
        )}
      </div>

      <LocationMap
        sharedLocations={sharedLocations}
        center={sharedLocations[0]?.position}
      />

      <ShareLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contacts={contacts}
        onStartSharing={startSharing}
      />
    </div>
  );
}; 