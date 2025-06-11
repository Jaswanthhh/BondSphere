import React, { useState, useEffect } from "react";
import { Search, MapPin, Building2, DollarSign, Briefcase, BookmarkPlus, ChevronDown, Filter, Bookmark, Star, Users, UserPlus, MessageSquare, Newspaper } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { JobProfile } from "../Profile/JobProfile";
import { Connections } from "./Connections";
import { ConnectionRequests } from "./ConnectionRequests";
import { JobChat } from "./JobChat";
import { JobFeed } from "./JobFeed";
import { jobsApi } from '../../services/api';

export const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await jobsApi.getJobs();
        console.log('jobs data:', res.data);
        setJobs(Array.isArray(res.data) ? res.data : []);
        setFilteredJobs(res.data);
        setRecommendedJobs(res.data.filter(job => job.isRecommended));
      } catch (err) {
        setError("Failed to load jobs.");
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleSearch = () => {
    const filtered = jobs.filter(job => {
      const searchString = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchString) ||
        job.company.toLowerCase().includes(searchString) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchString))
      );
    });
    setFilteredJobs(filtered);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    const filtered = jobs.filter(job => {
      if (!category) return true;
      return (
        job.type.toLowerCase().includes(category.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
      );
    });
    setFilteredJobs(filtered);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMessage('Job added!');
      setForm({ title: '', company: '', location: '', description: '' });
      fetchJobs(); // Refresh the jobs list
    } else {
      setMessage('Error adding job');
    }
  };

  const handleApply = (jobId) => {
    setAppliedJobs(prev => {
      const newAppliedJobs = new Set(prev);
      if (newAppliedJobs.has(jobId)) {
        newAppliedJobs.delete(jobId);
      } else {
        newAppliedJobs.add(jobId);
      }
      return newAppliedJobs;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Please log in to view jobs</p>
      </div>
    );
  }

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "listings"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>Job Listings</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "feed"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("feed")}
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              <span>Professional Feed</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span>Job Profile</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "connections"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("connections")}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>My Network</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span>Network Requests</span>
            </div>
          </button>
        </div>

        {/* Chat Button */}
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showChat ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setShowChat(!showChat)}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>Network Chat</span>
          </div>
        </button>
      </div>

      {activeTab === "profile" ? (
        <JobProfile />
      ) : activeTab === "connections" ? (
        <Connections />
      ) : activeTab === "requests" ? (
        <ConnectionRequests />
      ) : activeTab === "feed" ? (
        <JobFeed />
      ) : (
        <>
          {/* Search Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or keywords"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-3 border border-gray-200 rounded-xl flex items-center gap-2 hover:border-gray-300 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">Filters</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  className="px-6 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-colors"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Job Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Categories</h2>
            <div className="flex gap-3">
              {["Remote", "Full-Time", "Technology", "Marketing"].map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
              <button
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
                onClick={() => {
                  setSelectedCategory(null);
                  setFilteredJobs(jobs);
                }}
              >
                View All
              </button>
            </div>
          </div>

          {/* All Job Listings */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Job Posts</h2>
              <button 
                className="text-[#3B82F6] hover:text-[#2563EB] font-medium"
                onClick={() => setFilteredJobs(jobs)}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job._id || job.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <img 
                          src={job.logo || '/default-image.png'} 
                          alt={`${job.company || 'Company'} logo`} 
                          className="w-8 h-8 object-contain"
                          onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title || 'No Title'}</h3>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.type || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleApply(job._id || job.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          appliedJobs.has(job._id || job.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {appliedJobs.has(job._id || job.id) ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(job.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-[#3B82F6] text-sm rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Based on your profile and preferences</span>
              </div>
            </div>

            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <img 
                          src={job.logo || '/default-image.png'} 
                          alt={`${job.company} logo`} 
                          className="w-8 h-8 object-contain"
                          onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                            {job.matchScore}% Match
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleApply(job.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          appliedJobs.has(job.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {appliedJobs.has(job.id) ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-[#3B82F6] text-sm rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Chat Component */}
      {showChat && <JobChat onClose={() => setShowChat(false)} />}

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Post a New Job</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
          <input name="company" value={form.company} onChange={handleChange} placeholder="Company" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            Add Job
          </button>
          {message && <div>{message}</div>}
        </form>

        <h2>Job Listings</h2>
        {loading ? (
          <div>Loading...</div>
        ) : !jobs.length ? (
          <div>No jobs found.</div>
        ) : (
          jobs.map(job => (
            <div key={job._id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3>{job.title}</h3>
              <p><b>Company:</b> {job.company}</p>
              <p><b>Location:</b> {job.location}</p>
              <p>{job.description}</p>
              <p style={{ fontSize: 12, color: '#888' }}>Posted: {job.postedAt ? new Date(job.postedAt).toLocaleString() : 'N/A'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 