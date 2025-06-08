import React, { useState, useEffect } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Building2, GraduationCap, Briefcase, Plus, Pencil, Save, X } from 'lucide-react';
import { users as usersApi } from '../../services/api';

export const JobProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await usersApi.getProfile('me');
        setProfileData(res.data);
        // Calculate profile completion (simple example)
        let fields = ['about', 'skills', 'experience', 'education', 'availability', 'preferredRole', 'salary', 'workType'];
        let filled = fields.filter(f => {
          const val = res.data[f];
          return Array.isArray(val) ? val.length > 0 : !!val;
        }).length;
        setProfileCompletion(Math.round((filled / fields.length) * 100));
      } catch (err) {
        setError('Failed to load job profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    // Optionally refetch to reset changes
  };
  const handleSave = async () => {
    setIsEditing(false);
    try {
      await usersApi.updateProfile(profileData._id || 'me', profileData);
    } catch (err) {
      setError('Failed to update job profile');
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  const handleArrayChange = (field, index, value) => {
    setProfileData(prev => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };
  const handleAddArrayItem = (field) => {
    setProfileData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };
  const handleRemoveArrayItem = (field, index) => {
    setProfileData(prev => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  if (loading) return <div>Loading job profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profileData) return null;

  // Fallbacks for missing fields
  profileData.skills = profileData.skills || [];
  profileData.experience = profileData.experience || [];
  profileData.education = profileData.education || [];
  profileData.workType = profileData.workType || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Cover and Profile Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-48 relative">
            <img
              src={profileData.coverImage || '/default-image.png'}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
            />
            {!isEditing && (
              <button 
                className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                aria-label="Edit cover photo"
                title="Edit cover photo"
                onClick={handleEdit}
              >
                <Pencil className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {isEditing && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={handleSave} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Save className="w-5 h-5" /></button>
                <button onClick={handleCancel} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"><X className="w-5 h-5" /></button>
              </div>
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-start -mt-16 relative mb-4">
              <div className="flex gap-4 items-end">
                <img
                  src={profileData.avatar || '/default-avatar.png'}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                  <p className="text-gray-600">{profileData.title}</p>
                </div>
              </div>
            </div>
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{profileData.location}</span>
              </div>
              {profileData.website && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  <a href={`https://${profileData.website}`} className="text-blue-500 hover:underline">
                    {profileData.website}
                  </a>
                </div>
              )}
              {profileData.linkedin && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  <a href={`https://${profileData.linkedin}`} className="text-blue-500 hover:underline">
                    {profileData.linkedin}
                  </a>
                </div>
              )}
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
                {isEditing && (
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit about section"
                    title="Edit about section"
                  >
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  name="about"
                  value={profileData.about || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{profileData.about}</p>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                {isEditing && (
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Add new experience"
                    title="Add new experience"
                    onClick={() => handleAddArrayItem('experience')}
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {profileData.experience.map((job, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name={`experience-role-${idx}`}
                            value={job.role || ''}
                            onChange={e => handleArrayChange('experience', idx, { ...job, role: e.target.value })}
                            placeholder="Role"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            name={`experience-company-${idx}`}
                            value={job.company || ''}
                            onChange={e => handleArrayChange('experience', idx, { ...job, company: e.target.value })}
                            placeholder="Company"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            name={`experience-location-${idx}`}
                            value={job.location || ''}
                            onChange={e => handleArrayChange('experience', idx, { ...job, location: e.target.value })}
                            placeholder="Location"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            name={`experience-duration-${idx}`}
                            value={job.duration || ''}
                            onChange={e => handleArrayChange('experience', idx, { ...job, duration: e.target.value })}
                            placeholder="Duration"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <textarea
                            name={`experience-description-${idx}`}
                            value={job.description || ''}
                            onChange={e => handleArrayChange('experience', idx, { ...job, description: e.target.value })}
                            placeholder="Description"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            name={`experience-skills-${idx}`}
                            value={Array.isArray(job.skills) ? job.skills.join(', ') : ''}
                            onChange={e => handleArrayChange('experience', idx, { ...job, skills: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="Skills (comma separated)"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <button onClick={() => handleRemoveArrayItem('experience', idx)} className="text-red-500 text-xs mt-1">Remove</button>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900">{job.role}</h3>
                          <p className="text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.duration}</p>
                          <p className="text-gray-600 mt-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {Array.isArray(job.skills) && job.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                {isEditing && (
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Add new education"
                    title="Add new education"
                    onClick={() => handleAddArrayItem('education')}
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {profileData.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name={`education-degree-${idx}`}
                            value={edu.degree || ''}
                            onChange={e => handleArrayChange('education', idx, { ...edu, degree: e.target.value })}
                            placeholder="Degree"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            name={`education-school-${idx}`}
                            value={edu.school || ''}
                            onChange={e => handleArrayChange('education', idx, { ...edu, school: e.target.value })}
                            placeholder="School"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            name={`education-duration-${idx}`}
                            value={edu.duration || ''}
                            onChange={e => handleArrayChange('education', idx, { ...edu, duration: e.target.value })}
                            placeholder="Duration"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <textarea
                            name={`education-description-${idx}`}
                            value={edu.description || ''}
                            onChange={e => handleArrayChange('education', idx, { ...edu, description: e.target.value })}
                            placeholder="Description"
                            className="border rounded-md px-2 py-1 mb-1 w-full"
                          />
                          <button onClick={() => handleRemoveArrayItem('education', idx)} className="text-red-500 text-xs mt-1">Remove</button>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.duration}</p>
                          <p className="text-gray-600 mt-2">{edu.description}</p>
                        </>
                      )}
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
                {isEditing && (
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit job preferences"
                    title="Edit job preferences"
                  >
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Availability</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="availability"
                      value={profileData.availability || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.availability}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Preferred Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="preferredRole"
                      value={profileData.preferredRole || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.preferredRole}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Expected Salary</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="salary"
                      value={profileData.salary || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.salary}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Work Type</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="workType"
                      value={profileData.workType.join(', ')}
                      onChange={e => setProfileData(prev => ({ ...prev, workType: e.target.value.split(',').map(s => s.trim()) }))}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.workType.map((type, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                {isEditing && (
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Add new skill"
                    title="Add new skill"
                    onClick={() => handleAddArrayItem('skills')}
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, idx) => (
                  isEditing ? (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={skill}
                        onChange={e => handleArrayChange('skills', idx, e.target.value)}
                        className="border rounded-md px-2 py-1"
                      />
                      <button onClick={() => handleRemoveArrayItem('skills', idx)} className="text-red-500 text-xs">Remove</button>
                    </div>
                  ) : (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                    >
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 