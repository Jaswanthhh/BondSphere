import React, { useState, useEffect } from 'react';
import { MapPin, Share2, Users, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ShareLocationModal } from './ShareLocationModal';

export const LocationSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingWith, setSharingWith] = useState([]);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);

  // Mock contacts data
  const contacts = [
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'David Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?img=6' },
  ];

  // Mock data for demonstration
  const mockSharedLocations = [
    {
      userId: '1',
      userName: 'John Doe',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        timestamp: Date.now() - 3600000, // 1 hour ago
      },
    },
    {
      userId: '2',
      userName: 'Jane Smith',
      location: {
        latitude: 37.7833,
        longitude: -122.4167,
        timestamp: Date.now() - 1800000, // 30 minutes ago
      },
    },
  ];

  useEffect(() => {
    // Load mock data
    setSharedLocations(mockSharedLocations);
  }, []);

  // Update location periodically when sharing is active
  useEffect(() => {
    if (isSharing && currentLocation) {
      // Clear any existing interval
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }

      // Set up a new interval to update location every 10 seconds
      const interval = window.setInterval(() => {
        updateLocation();
      }, 10000);

      setLocationUpdateInterval(interval);

      // Clean up interval on unmount or when sharing stops
      return () => {
        clearInterval(interval);
      };
    }
  }, [isSharing, currentLocation]);

  const updateLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
      };

      setCurrentLocation(newLocation);

      // Update shared locations if we're sharing with anyone
      if (sharingWith.length > 0) {
        updateSharedLocations(newLocation);
      }
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const updateSharedLocations = (location) => {
    setSharedLocations(prevLocations => {
      // Create a new array with updated locations
      const updatedLocations = [...prevLocations];
      
      // Update locations for users we're sharing with
      sharingWith.forEach(userId => {
        const existingIndex = updatedLocations.findIndex(loc => loc.userId === userId);
        
        if (existingIndex >= 0) {
          // Update existing location
          updatedLocations[existingIndex] = {
            ...updatedLocations[existingIndex],
            location: {
              ...location,
              // Add a small random offset to simulate movement
              latitude: location.latitude + (Math.random() - 0.5) * 0.001,
              longitude: location.longitude + (Math.random() - 0.5) * 0.001,
            }
          };
        } else {
          // Add new location for this user
          const contact = contacts.find(c => c.id === userId);
          if (contact) {
            updatedLocations.push({
              userId,
              userName: contact.name,
              location: {
                ...location,
                // Add a small random offset to simulate movement
                latitude: location.latitude + (Math.random() - 0.5) * 0.001,
                longitude: location.longitude + (Math.random() - 0.5) * 0.001,
              }
            });
          }
        }
      });
      
      return updatedLocations;
    });
  };

  const startSharing = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
      };

      setCurrentLocation(newLocation);
      setIsSharing(true);
      setError(null);
    } catch (err) {
      setError('Unable to access location. Please ensure location services are enabled.');
      console.error('Error getting location:', err);
    }
  };

  const stopSharing = () => {
    setIsSharing(false);
    setCurrentLocation(null);
    setSharingWith([]);
    
    // Clear the update interval
    if (locationUpdateInterval) {
      clearInterval(locationUpdateInterval);
      setLocationUpdateInterval(null);
    }
  };

  const handleShareLocation = (selectedContacts) => {
    setSharingWith(selectedContacts);
    
    // If we have a current location, update the shared locations immediately
    if (currentLocation) {
      updateSharedLocations(currentLocation);
    }
    
    // Show a success message
    alert(`Location shared with ${selectedContacts.length} contact(s)!`);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Location Sharing</h1>
            <div className="flex gap-3">
              {isSharing && (
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
              )}
              <Button
                onClick={isSharing ? stopSharing : startSharing}
                className={`${
                  isSharing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {isSharing ? 'Stop Sharing' : 'Start Sharing'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {currentLocation && (
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Your Location</span>
              </div>
              <p className="text-gray-600">
                Latitude: {currentLocation.latitude.toFixed(6)}
                <br />
                Longitude: {currentLocation.longitude.toFixed(6)}
                <br />
                Last updated: {formatTimeAgo(currentLocation.timestamp)}
              </p>
              {sharingWith.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm text-blue-700">
                    Currently sharing with {sharingWith.length} {sharingWith.length === 1 ? 'contact' : 'contacts'}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Shared Locations
            </h2>
            {sharedLocations.length > 0 ? (
              sharedLocations.map((shared) => (
                <div
                  key={shared.userId}
                  className="bg-gray-50 p-4 rounded-xl flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{shared.userName}</span>
                      {sharingWith.includes(shared.userId) && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Latitude: {shared.location.latitude.toFixed(6)}
                      <br />
                      Longitude: {shared.location.longitude.toFixed(6)}
                      <br />
                      Last updated: {formatTimeAgo(shared.location.timestamp)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-500">
                No shared locations yet. Start sharing your location to see updates here.
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareLocationModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShareLocation}
        currentLocation={currentLocation}
      />
    </div>
  );
}; 