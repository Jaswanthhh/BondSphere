import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Building2, Globe, Linkedin, Twitter, Instagram, Facebook, Edit2, Save, X } from 'lucide-react';
import { JobProfile } from './JobProfile';

export const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced software engineer with a passion for building scalable applications.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        period: '2020 - Present',
        description: 'Leading development of enterprise applications.'
      },
      {
        title: 'Software Engineer',
        company: 'StartUp Inc',
        period: '2018 - 2020',
        description: 'Developed and maintained web applications.'
      }
    ],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        school: 'Stanford University',
        period: '2016 - 2018'
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        period: '2012 - 2016'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe'
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-50"
              >
                <Edit2 className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.title} at {profileData.company}</p>
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`${
                    activeTab === 'personal'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('job')}
                  className={`${
                    activeTab === 'job'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Job Profile
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="flex-1 border rounded-md px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">{profileData.email}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="flex-1 border rounded-md px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">{profileData.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="flex-1 border rounded-md px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">{profileData.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.bio}</p>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
                  <div className="space-y-2">
                    <a
                      href={profileData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <Linkedin className="h-5 w-5 mr-2" />
                      LinkedIn
                    </a>
                    <a
                      href={profileData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <Twitter className="h-5 w-5 mr-2" />
                      Twitter
                    </a>
                    <a
                      href={profileData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <JobProfile />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 