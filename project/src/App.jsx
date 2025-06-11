import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Desktop } from './screens/Desktop';
import { SignUp } from './screens/SignUp';
import { Home } from './screens/Home';
import { Feed } from './screens/Feed';
import { Messages } from './screens/Messages';
import { Communities, CommunityHome, CommunityDetails } from './screens/Communities';
import { Travel, TravelDetails } from './screens/Travel';
import { Jobs } from './screens/Jobs';
import { Analytics } from './screens/Analytics';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';
import { LocationSharing } from './screens/LocationSharing';
import { ConnectionRequests } from './screens/ConnectionRequests';
import { People } from './screens/People/People';
import ProtectedRoute from './ui/protected-route';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Desktop />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Optionally add: <Route path="/login" element={<LoginForm />} /> */}

        {/* Protected nested routes for /home */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
          <Route index element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="communities" element={<Communities />} />
          <Route path="communities/:id" element={<CommunityDetails />} />
          <Route path="travel" element={<Travel />} />
          <Route path="travel/:listingId" element={<TravelDetails />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="location" element={<LocationSharing />} />
          <Route path="connections" element={<ConnectionRequests />} />
        </Route>

        <Route path="/people" element={<People />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App; 