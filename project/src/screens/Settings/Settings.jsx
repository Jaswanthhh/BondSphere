import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('Connected account');
  const [googleConnected, setGoogleConnected] = useState(true);
  const [slackConnected, setSlackConnected] = useState(true);
  const [dropboxConnected, setDropboxConnected] = useState(false);

  const tabs = {
    'Settings': ['Overview', 'Sign in method', 'Basic Information', 'Connected account', 'Notifications', 'Deactivate account'],
  };

  const mainCategories = ['Profile', 'Settings', 'Referrals', 'Invite a Friend'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-800">Account Settings</h1>
        </div>

        <div className="px-3 py-4">
          {mainCategories.map((category) => {
            const isExpanded = category === 'Settings';
            
            return (
              <div key={category} className="mb-1">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg ${activeTab.includes(category) || (isExpanded && tabs[category]?.includes(activeTab)) ? 'text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 border-l border-gray-200 pl-4">
                    {tabs[category]?.map((subItem) => (
                      <button
                        key={subItem}
                        className={`w-full text-left px-2 py-2 text-sm rounded-lg ${activeTab === subItem ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab(subItem)}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Connected Accounts</h1>

            {/* Security Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                <Check className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Secure Your Account</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Two-factor authentication adds an extra layer of security to your account. To log in, in addition you'll need to provide a 6 digit code. 
                  <a href="#" className="text-blue-500 ml-1">Learn more</a>
                </p>
              </div>
            </div>

            {/* Connected Services */}
            <div className="space-y-6">
              {/* Google */}
              <div className="py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-8 object-contain" />
                  <div>
                    <h3 className="font-medium text-gray-800">Google</h3>
                    <p className="text-gray-500 text-sm">Plan properly your workflow</p>
                  </div>
                </div>
                <Switch 
                  checked={googleConnected} 
                  onCheckedChange={setGoogleConnected}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>

              {/* Slack */}
              <div className="py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="h-8 object-contain" />
                  <div>
                    <h3 className="font-medium text-gray-800">Slack</h3>
                    <p className="text-gray-500 text-sm">Integrate Projects Discussions</p>
                  </div>
                </div>
                <Switch 
                  checked={slackConnected} 
                  onCheckedChange={setSlackConnected}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>

              {/* Dropbox */}
              <div className="py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/app-dropbox.png" alt="Dropbox" className="h-8 object-contain" />
                  <div>
                    <h3 className="font-medium text-gray-800">Dropbox</h3>
                    <p className="text-gray-500 text-sm">Integrate Projects Management</p>
                  </div>
                </div>
                <Switch 
                  checked={dropboxConnected} 
                  onCheckedChange={setDropboxConnected}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-8 py-4 rounded-b-xl flex justify-end gap-3">
            <Button variant="outline" className="bg-white">
              Discard
            </Button>
            <Button className="bg-indigo-500 hover:bg-indigo-600">
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 