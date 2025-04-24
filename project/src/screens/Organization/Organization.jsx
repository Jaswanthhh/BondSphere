import React, { useState } from 'react';
import { Building2, Edit, Users, Globe, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const Organization = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock organization data - in a real app, this would come from an API
  const [organization, setOrganization] = useState({
    name: 'Acme Corporation',
    description: 'A leading provider of innovative solutions for businesses worldwide.',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/1200x300',
    industry: 'Technology',
    size: '100-500 employees',
    founded: '2010',
    location: 'San Francisco, CA',
    website: 'https://www.acmecorp.com',
    email: 'contact@acmecorp.com',
    phone: '+1 (555) 123-4567',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/acmecorp',
      twitter: 'https://twitter.com/acmecorp',
      facebook: 'https://facebook.com/acmecorp'
    },
    members: [
      { id: 1, name: 'John Doe', role: 'CEO', avatar: 'https://via.placeholder.com/40' },
      { id: 2, name: 'Jane Smith', role: 'CTO', avatar: 'https://via.placeholder.com/40' },
      { id: 3, name: 'Bob Johnson', role: 'CFO', avatar: 'https://via.placeholder.com/40' },
      { id: 4, name: 'Alice Williams', role: 'COO', avatar: 'https://via.placeholder.com/40' }
    ]
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Organization Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="h-48 relative">
            <img
              src={organization.coverImage}
              alt="Organization Cover"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <button 
                className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                aria-label="Edit cover photo"
                title="Edit cover photo"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative -mt-16 md:mt-0">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-md">
                <img
                  src={organization.logo}
                  alt={`${organization.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button 
                  className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  aria-label="Edit logo"
                  title="Edit logo"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                  <p className="text-gray-500 mt-1">{organization.industry}</p>
                </div>
                
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEditToggle}>
                      Edit Organization
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mt-4">{organization.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-gray-500">
                  <Building2 className="w-4 h-4 mr-1.5" />
                  <span>{organization.size}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Globe className="w-4 h-4 mr-1.5" />
                  <span>Founded {organization.founded}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>{organization.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Organization Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600">
                {organization.description}
              </p>
              <p className="text-gray-600 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-600 mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            
            {/* Team Members Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {organization.members.map(member => (
                  <div key={member.id} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{organization.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{organization.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{organization.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <LinkIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {organization.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
              
              <div className="space-y-3">
                <a 
                  href={organization.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="text-gray-900">LinkedIn</span>
                </a>
                
                <a 
                  href={organization.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </div>
                  <span className="text-gray-900">Twitter</span>
                </a>
                
                <a 
                  href={organization.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-900">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 