import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Linkedin, Twitter, Instagram, Github, Camera } from 'lucide-react';
import { JobProfile } from './JobProfile';
import { users as usersApi } from '../../services/api';
import { API_BASE_URL } from '../../config';

export const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    socialLinks: { linkedin: '', twitter: '', github: '' },
    avatar: '',
    coverImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await usersApi.getProfile();
        setProfileData({
          ...res.data,
          socialLinks: res.data.socialLinks || { linkedin: '', twitter: '', github: '' },
          skills: Array.isArray(res.data.skills) ? res.data.skills : [],
        });
      } catch (err) {
        setError('Failed to load profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
  };

  const handleSkillsChange = (e) => {
    setProfileData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (key === 'skills') {
          formData.append('skills', JSON.stringify(value));
        } else if (key === 'socialLinks') {
          formData.append('socialLinks', JSON.stringify(value));
        } else if (key === 'friends' && Array.isArray(value)) {
          const cleanFriends = value.filter(id => !!id && id !== '');
          formData.append('friends', JSON.stringify(cleanFriends));
        } else if (key === 'fullName') {
          formData.append('fullName', value);
        } else if (key === 'avatar' || key === 'coverImage') {
          // Only send as file if changed
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });
      if (avatarFile) formData.append('avatar', avatarFile);
      const res = await usersApi.updateProfile(formData);
      setProfileData({
        ...res.data,
        socialLinks: res.data.socialLinks || { linkedin: '', twitter: '', github: '' },
        skills: Array.isArray(res.data.skills) ? res.data.skills : [],
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
          {/* Avatar */}
          <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
            <div className="relative w-32 h-32">
              <img
                src={avatarPreview || (profileData.avatar ? (profileData.avatar.startsWith('http') ? profileData.avatar : `${API_BASE_URL}${profileData.avatar}`) : '/default-avatar.png')}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
              />
              {isEditing && (
                <button
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  onClick={() => fileInputRef.current.click()}
                  title="Change avatar"
                >
                  <Camera className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>
        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-50 z-10"
            style={{ margin: 16 }}
          >
            <Edit2 className="h-5 w-5 text-gray-600" />
          </button>
        )}
        {/* Profile Content */}
        <div className="pt-24 pb-10 px-8">
          <div className="flex flex-col items-center mb-6">
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={profileData.fullName || ''}
                onChange={handleInputChange}
                className="text-2xl font-bold text-center border-b-2 border-blue-200 focus:border-blue-500 outline-none mb-2"
                placeholder="Full Name"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h1>
            )}
            <p className="text-gray-500">{profileData.email}</p>
          </div>
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'personal' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('job')}
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'job' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}
            >
              Job Profile
            </button>
          </div>
          {/* Tab Content */}
          {activeTab === 'personal' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.location}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{profileData.bio}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    value={Array.isArray(profileData.skills) ? profileData.skills.join(', ') : ''}
                    onChange={handleSkillsChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Links</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="linkedin"
                          value={profileData.socialLinks.linkedin || ''}
                          onChange={handleSocialChange}
                          className="w-full border rounded-md px-2 py-1"
                          placeholder="LinkedIn URL"
                        />
                      ) : (
                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Twitter className="w-5 h-5 text-blue-500" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="twitter"
                          value={profileData.socialLinks.twitter || ''}
                          onChange={handleSocialChange}
                          className="w-full border rounded-md px-2 py-1"
                          placeholder="Twitter URL"
                        />
                      ) : (
                        <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="w-5 h-5 text-gray-800" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="github"
                          value={profileData.socialLinks.github || ''}
                          onChange={handleSocialChange}
                          className="w-full border rounded-md px-2 py-1"
                          placeholder="GitHub URL"
                        />
                      ) : (
                        <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    <Save className="inline-block w-5 h-5 mr-1" /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    <X className="inline-block w-5 h-5 mr-1" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <JobProfile />
          )}
        </div>
      </div>
    </div>
  );
}; 