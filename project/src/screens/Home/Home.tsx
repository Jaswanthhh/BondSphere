import React, { useState, useEffect } from "react";
import { Grid, MessageSquare, Users, Briefcase, PenSquare, Plane, LayoutGrid, Bell, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import { Jobs } from "../Jobs/Jobs";
import { Profile } from "../Profile/Profile";
import { Feed } from "../Feed";
import { Messages } from "../Messages";
import { Settings } from "../Settings";
import { Notifications } from "../../components/Notifications";
import { Connections } from "../Jobs/Connections";
import { Communities } from '../Communities/Communities';
import { Travel } from '../Travel/Travel';

export const Home = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>(() => {
    const path = location.pathname;
    const section = path.split('/').pop();
    return (section && section !== 'home') ? section : 'feed';
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications] = useState(3);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  const handleSectionClick = (section: string) => {
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

  const handleLogoClick = () => {
    setActiveSection("feed");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar - Fixed width on desktop, full width on mobile */}
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
                  aria-label="Notifications"
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
                  <div className="w-12 h-12 rounded-full bg-[#BFDBFE]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium">Katie Pena</h3>
                  <p className="text-gray-500 text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-4 py-6">
              <div className="space-y-2">
                <button 
                  className={`group w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                    activeSection === "feed" 
                      ? "text-[#3B82F6] bg-blue-50 shadow-sm" 
                      : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/60 hover:translate-x-1"
                  }`} 
                  onClick={() => handleSectionClick("feed")}
                  aria-label="Feed"
                >
                  <div className={`transition-transform duration-300 ${activeSection === "feed" ? "scale-110" : "group-hover:scale-110"}`}>
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <span className="relative overflow-hidden">
                    Feed
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                      activeSection === "feed" ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                </button>
                
                <button 
                  className={`group w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                    activeSection === "messages" 
                      ? "text-[#3B82F6] bg-blue-50 shadow-sm" 
                      : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/60 hover:translate-x-1"
                  }`} 
                  onClick={() => handleSectionClick("messages")}
                  aria-label="Messages"
                >
                  <div className={`transition-transform duration-300 ${activeSection === "messages" ? "scale-110" : "group-hover:scale-110"}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="relative overflow-hidden">
                    Messages
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                      activeSection === "messages" ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                </button>
                
                <button 
                  className={`group w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                    activeSection === "communities" 
                      ? "text-[#3B82F6] bg-blue-50 shadow-sm" 
                      : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/60 hover:translate-x-1"
                  }`} 
                  onClick={() => handleSectionClick("communities")}
                  aria-label="Communities"
                >
                  <div className={`transition-transform duration-300 ${activeSection === "communities" ? "scale-110" : "group-hover:scale-110"}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="relative overflow-hidden">
                    Communities
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                      activeSection === "communities" ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                </button>
                
                <button 
                  className={`group w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                    activeSection === "jobs" 
                      ? "text-[#3B82F6] bg-blue-50 shadow-sm" 
                      : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/60 hover:translate-x-1"
                  }`} 
                  onClick={() => handleSectionClick("jobs")}
                  aria-label="Jobs"
                >
                  <div className={`transition-transform duration-300 ${activeSection === "jobs" ? "scale-110" : "group-hover:scale-110"}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="relative overflow-hidden">
                    Jobs
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                      activeSection === "jobs" ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                </button>
                
                <button 
                  className={`group w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                    activeSection === "travel" 
                      ? "text-[#3B82F6] bg-blue-50 shadow-sm" 
                      : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/60 hover:translate-x-1"
                  }`} 
                  onClick={() => handleSectionClick("travel")}
                  aria-label="Travel Connect"
                >
                  <div className={`transition-transform duration-300 ${activeSection === "travel" ? "scale-110" : "group-hover:scale-110"}`}>
                    <Plane className="w-5 h-5" />
                  </div>
                  <span className="relative overflow-hidden">
                    Travel Connect
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                      activeSection === "travel" ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                </button>
              </div>
            </div>

            {/* Settings Button (replaced Create Post) - Redesigned to be sleeker and more animated */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <button 
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out rounded-xl flex items-center justify-center gap-3 group shadow-md"
                onClick={() => handleSectionClick("settings")} 
                aria-label="Settings"
              >
                <div className="bg-white/20 p-2 rounded-lg transform group-hover:rotate-45 transition-transform duration-300">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="h-full bg-white shadow-lg rounded-[28px] border border-gray-100">
            <div className="flex-1 min-w-0 overflow-auto">
              {activeSection === "feed" && <Feed />}
              {activeSection === "messages" && <Messages />}
              {activeSection === "communities" && <Communities />}
              {activeSection === "jobs" && <Jobs />}
              {activeSection === "travel" && <Travel />}
              {activeSection === "profile" && <Profile />}
              {activeSection === "settings" && <Settings />}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Popup */}
      <Notifications 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};