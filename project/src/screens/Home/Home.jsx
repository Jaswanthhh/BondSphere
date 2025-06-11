import React, { useState, useEffect } from "react";
import { Grid, MessageSquare, Users, Briefcase, PenSquare, Plane, LayoutGrid, Bell, Settings as SettingsIcon, Building2, MapPin } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Jobs } from "../Jobs";
import { Profile } from "../Profile";
import { Feed } from "../Feed";
import { Messages } from "../Messages";
import { Settings } from "../Settings";
import { Notifications } from "../../components/Notifications";
import { Communities } from '../Communities';
import { Travel } from '../Travel';
import { LocationSharing } from '../LocationSharing';
import { users as usersApi } from '../../services/api';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    const path = location.pathname;
    const section = path.split('/').pop();
    return (section && section !== 'home') ? section : 'feed';
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications] = useState(3);
  const [userProfile, setUserProfile] = useState(null);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  const handleSectionClick = (section) => {
    setActiveSection(section);
    navigate(`/home/${section}`);
  };

  useEffect(() => {
    const path = location.pathname;
    const section = path.split('/').pop();
    if (section && section !== 'home') {
      setActiveSection(section);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await usersApi.getProfile();
        setUserProfile(res.data);
      } catch (err) {
        setUserProfile(null);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogoClick = () => {
    setActiveSection("feed");
    navigate("/home");
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'feed':
        return <Feed />;
      case 'messages':
        return <Messages />;
      case 'communities':
        return <Communities />;
      case 'jobs':
        return <Jobs />;
      case 'travel':
        return <Travel />;
      case 'location':
        return <LocationSharing />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar */}
        <div className="w-full lg:w-64 h-auto lg:h-screen p-4 lg:p-0">
          <div className="h-full bg-white shadow-lg rounded-[28px] border border-gray-100 relative">
            {/* Brand */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="flex-1 flex items-center cursor-pointer hover:opacity-90 transition-opacity mr-4"
                  onClick={handleLogoClick}
                >
                  <img className="w-8 h-8 mr-3 flex-shrink-0" alt="Icon" src="/icon.png" />
                  <h1 className="font-semibold text-xl text-[#232323] tracking-[-0.5px] whitespace-nowrap">
                    BondSphere
                  </h1>
                </div>
                <button 
                  className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors flex-shrink-0"
                  onClick={() => setShowNotifications(true)}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadNotifications}
                    </div>
                  )}
                </button>
              </div>

              {/* Profile Section */}
              <div 
                className="flex items-center space-x-4 cursor-pointer hover:bg-blue-50 p-2 rounded-xl transition-colors"
                onClick={() => handleSectionClick("profile")}
              >
                <div className="relative w-12 h-12">
                  <img
                    src={userProfile?.avatar ? (userProfile.avatar.startsWith('http') ? userProfile.avatar : `http://localhost:5000${userProfile.avatar}`) : '/default-avatar.png'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover bg-[#BFDBFE]"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium">{userProfile?.fullName || 'User'}</h3>
                  <p className="text-gray-500 text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-4 py-6">
              <div className="space-y-2">
                {[
                  { name: 'feed', icon: LayoutGrid, label: 'Feed' },
                  { name: 'messages', icon: MessageSquare, label: 'Messages' },
                  { name: 'people', icon: Users, label: 'People' },
                  { name: 'communities', icon: Users, label: 'Communities' },
                  { name: 'jobs', icon: Briefcase, label: 'Jobs' },
                  { name: 'travel', icon: Plane, label: 'Travel Connect' },
                  { name: 'location', icon: MapPin, label: 'Location Sharing' },
                ].map(({ name, icon: Icon, label }) => (
                  <button 
                    key={name}
                    className={`group w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                      activeSection === name 
                        ? "text-[#3B82F6] bg-blue-50 shadow-sm" 
                        : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/60 hover:translate-x-1"
                    }`} 
                    onClick={() => {
                      if (name === 'people') {
                        navigate('/people');
                      } else {
                        handleSectionClick(name);
                      }
                    }}
                  >
                    <div className={`transition-transform duration-300 ${activeSection === name ? "scale-110" : "group-hover:scale-110"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="relative overflow-hidden">
                      {label}
                      <span className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                        activeSection === name ? "w-full" : "w-0 group-hover:w-full"
                      }`}></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Button */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <button 
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out rounded-xl flex items-center justify-center gap-3 group shadow-md"
                onClick={() => handleSectionClick("settings")}
              >
                <SettingsIcon className="w-5 h-5 text-white transform group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-white font-semibold">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="bg-white rounded-[28px] p-6 min-h-[calc(100vh-3rem)] shadow-lg border border-gray-100">
            <Outlet />
          </div>
        </div>

        {/* Notifications Popup */}
        {showNotifications && (
          <Notifications onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
}; 