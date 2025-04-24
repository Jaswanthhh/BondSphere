import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { Desktop } from './screens/Desktop';
import { SignUp } from './screens/SignUp';
import { Home } from './screens/Home';
import { Feed } from './screens/Feed';
import { Messages } from './screens/Messages';
import { Communities, CommunityHome, CommunityDetails } from './screens/Communities';
import { Travel, TravelDetails } from './screens/Travel';
import { Jobs } from './screens/Jobs';
import { Analytics } from './screens/Analytics';
import { Organization } from './screens/Organization';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';
import { LocationSharing } from './screens/LocationSharing';
import { ConnectionRequests } from './screens/ConnectionRequests';
import { ProtectedRoute } from './components/protected-route';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Desktop />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="messages" element={<Messages />} />
            <Route path="communities" element={<Communities />}>
              <Route index element={<Communities />} />
              <Route path=":communityId" element={<CommunityHome />} />
              <Route path=":communityId/details" element={<CommunityDetails />} />
            </Route>
            <Route path="travel">
              <Route index element={<Travel />} />
              <Route path=":listingId" element={<TravelDetails />} />
            </Route>
            <Route path="jobs" element={<Jobs />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="organization" element={<Organization />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="location" element={<LocationSharing />} />
            <Route path="connections" element={<ConnectionRequests />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 