import React, { useState, useEffect } from 'react';
import { Check, Info, Bell, Shield, Moon, Sun, Lock, User, Mail, Key, Globe, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { users as usersApi } from '../../services/api';
import { useAuth } from '../../lib/auth-context';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    account: {
      email: '',
      username: '',
      language: 'en',
      timezone: 'UTC',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      connectionRequests: true,
      messages: true,
      jobAlerts: true,
      communityUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true,
      allowTagging: true,
      allowMessaging: true,
    },
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordLastChanged: null,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
    },
    connectedAccounts: {
      google: false,
      slack: false,
      dropbox: false,
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await usersApi.getProfile('me');
        // Merge backend settings with defaults
        setSettings(prev => ({
          ...prev,
          account: {
            ...prev.account,
            email: res.data.email || '',
            username: res.data.username || '',
            language: res.data.language || 'en',
            timezone: res.data.timezone || 'UTC',
          },
          notifications: res.data.notifications || prev.notifications,
          privacy: res.data.privacy || prev.privacy,
          security: res.data.security || prev.security,
          appearance: res.data.appearance || prev.appearance,
          connectedAccounts: res.data.connectedAccounts || prev.connectedAccounts,
        }));
      } catch (err) {
        setError('Failed to load settings');
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await usersApi.updateProfile('me', settings);
      // Show success message
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await usersApi.deleteAccount('me');
        logout();
        navigate('/');
      } catch (err) {
        setError('Failed to delete account');
      }
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                <Info className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Account Information</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your account details and preferences. Your email is used for notifications and account recovery.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={settings.account.email}
                  onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <Input
                  type="text"
                  value={settings.account.username}
                  onChange={(e) => handleSettingChange('account', 'username', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  value={settings.account.language}
                  onChange={(e) => handleSettingChange('account', 'language', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={settings.account.timezone}
                  onChange={(e) => handleSettingChange('account', 'timezone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Notification Preferences</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Choose what notifications you want to receive and how you want to receive them.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <p className="text-sm text-gray-500">Receive notifications about {key.toLowerCase()}</p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleSettingChange('notifications', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Privacy Settings</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Control who can see your profile and interact with you.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="connections">Connections Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <p className="text-sm text-gray-500">Allow others to see your {key.toLowerCase()}</p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleSettingChange('privacy', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                <Lock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Security Settings</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your account security and authentication preferences.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-gray-900">Login Notifications</h4>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                </div>
                <Switch
                  checked={settings.security.loginNotifications}
                  onCheckedChange={(checked) => handleSettingChange('security', 'loginNotifications', checked)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                {settings.appearance.theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-blue-500" />
                ) : (
                  <Sun className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Appearance Settings</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Customize how the application looks and feels.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      settings.appearance.theme === 'light'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </button>
                  <button
                    onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      settings.appearance.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Font Size</label>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-gray-900">Compact Mode</h4>
                  <p className="text-sm text-gray-500">Use a more compact layout</p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                />
              </div>
            </div>
          </div>
        );

      case 'connected-accounts':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                <Globe className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Connected Accounts</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your connected third-party accounts and services.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.connectedAccounts).map(([service, isConnected]) => (
                <div key={service} className="py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png`}
                      alt={service}
                      className="h-8 object-contain"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">{service}</h3>
                      <p className="text-gray-500 text-sm">
                        {isConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isConnected}
                    onCheckedChange={(checked) => handleSettingChange('connectedAccounts', service, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'delete-account':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-red-100 rounded-full p-1.5 mt-0.5">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium text-red-800">Delete Account</h3>
                <p className="text-red-600 text-sm mt-1">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Before deleting your account, please note:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All your data will be permanently deleted</li>
                <li>You will lose access to all your content</li>
                <li>Your connections will be removed</li>
                <li>This action cannot be undone</li>
              </ul>

              <div className="pt-4">
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'connected-accounts', label: 'Connected Accounts', icon: Globe },
    { id: 'delete-account', label: 'Delete Account', icon: Trash2 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
        </div>

        <nav className="px-3 py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {renderContent()}

          {/* Footer Actions */}
          {activeTab !== 'delete-account' && (
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSettings(settings)}>
                Discard
              </Button>
              <Button onClick={handleSave}>
                Save changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 