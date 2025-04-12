import React, { useState } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Building2, GraduationCap, Briefcase, Plus, Pencil } from 'lucide-react';

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  skills: string[];
}

interface Education {
  id: number;
  degree: string;
  school: string;
  duration: string;
  description: string;
}

export const JobProfile = (): JSX.Element => {
  const [profileCompletion, setProfileCompletion] = useState(85);

  const user = {
    name: 'Katie Pena',
    title: 'Senior Product Designer',
    avatar: 'https://i.pravatar.cc/300?img=12',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    location: 'San Francisco, CA',
    openToWork: true,
    about: 'Experienced product designer with 8+ years of experience in creating user-centered digital experiences. Passionate about solving complex problems through design thinking and user research.',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Prototyping', 'Adobe Creative Suite', 'Design Thinking', 'Wireframing'],
    website: 'www.katiepena.design',
    linkedin: 'linkedin.com/in/katiepena',
    availability: 'Open to work',
    preferredRole: 'Senior Product Designer / Design Lead',
    salary: '$120k - $150k',
    workType: ['Full-time', 'Remote', 'Contract']
  };

  const experience: Experience[] = [
    {
      id: 1,
      role: 'Senior Product Designer',
      company: 'Dropbox',
      location: 'San Francisco, CA',
      duration: 'Jan 2020 - Present',
      description: 'Leading the design of core product features and contributing to the company\'s design system. Mentoring junior designers and collaborating with cross-functional teams.',
      skills: ['Product Design', 'Design Systems', 'Team Leadership']
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      duration: 'Jun 2017 - Dec 2019',
      description: 'Designed user-centered solutions for the Airbnb mobile app and website. Conducted user research and usability testing.',
      skills: ['Mobile Design', 'User Research', 'Prototyping']
    }
  ];

  const education: Education[] = [
    {
      id: 1,
      degree: 'Master of Design',
      school: 'California College of the Arts',
      duration: '2015 - 2017',
      description: 'Focus on Interaction Design and User Experience'
    },
    {
      id: 2,
      degree: 'Bachelor of Fine Arts',
      school: 'Rhode Island School of Design',
      duration: '2011 - 2015',
      description: 'Major in Graphic Design'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Cover and Profile Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-48 relative">
            <img
              src={user.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button 
              className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
              aria-label="Edit cover photo"
              title="Edit cover photo"
            >
              <Pencil className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-start -mt-16 relative mb-4">
              <div className="flex gap-4 items-end">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.title}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>
            </div>
            
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                <a href={`https://${user.website}`} className="text-blue-500 hover:underline">
                  {user.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                <a href={`https://${user.linkedin}`} className="text-blue-500 hover:underline">
                  {user.linkedin}
                </a>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-gray-900">Profile Completion</h2>
                <span className="text-blue-600 font-medium">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">About</h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Edit about section"
                  title="Edit about section"
                >
                  <Pencil className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-line">{user.about}</p>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add new experience"
                  title="Add new experience"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-6">
                {experience.map(job => (
                  <div key={job.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.role}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-500">{job.duration}</p>
                      <p className="text-gray-600 mt-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add new education"
                  title="Add new education"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-6">
                {education.map(edu => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.duration}</p>
                      <p className="text-gray-600 mt-2">{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Job Preferences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Job Preferences</h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Edit job preferences"
                  title="Edit job preferences"
                >
                  <Pencil className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Availability</label>
                  <p className="text-gray-900 font-medium">{user.availability}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Preferred Role</label>
                  <p className="text-gray-900 font-medium">{user.preferredRole}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Expected Salary</label>
                  <p className="text-gray-900 font-medium">{user.salary}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Work Type</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.workType.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add new skill"
                  title="Add new skill"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 