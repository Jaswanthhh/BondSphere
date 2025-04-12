import React, { useState } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Image, Video, PlaySquare } from 'lucide-react';

export const Profile = (): JSX.Element => {
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [postContent, setPostContent] = useState('');

  const user = {
    name: 'Katie Pena',
    username: '@katpena',
    following: 1077,
    followers: 376700,
    bio: 'Pushing pixels and experiences in digital products for Sebestudio',
    location: 'Yogyakarta, ID',
    website: 'dribbble.com/katpena',
    joinDate: 'June 2012',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    avatar: 'https://i.pravatar.cc/300?img=12',
    verified: true
  };

  const posts = [
    {
      id: 1,
      content: 'Just wrapped up an amazing design sprint with the team! 🚀',
      image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1',
      likes: 234,
      comments: 18,
      shares: 5,
      time: '2 hours ago'
    },
    {
      id: 2,
      content: "Check out our latest UI components library we\'ve been working on!",
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
      likes: 456,
      comments: 32,
      shares: 12,
      time: '1 day ago'
    }
  ];

  const photos = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc',
    'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b',
    'https://images.unsplash.com/photo-1554774853-719586f82d77'
  ];

  const tabs = ['Posting', 'Followers', 'Media', 'Likes', 'Tags'];
  const [activeTab, setActiveTab] = useState('Posting');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[800px] mx-auto">
        {/* Cover Image */}
        <div className="relative h-64 rounded-b-3xl overflow-hidden">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="px-8 -mt-20 relative">
          {/* Avatar and Edit Profile */}
          <div className="flex justify-between items-start mb-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {user.verified && (
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-gray-500 mb-2">{user.username}</p>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{user.following.toLocaleString()}</span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{user.followers.toLocaleString()}</span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Complete Your Profile</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{profileCompletion}% completed</p>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 mb-4">{user.bio}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <LinkIcon className="w-5 h-5" />
                <a href={`https://${user.website}`} className="text-blue-500 hover:underline">
                  {user.website}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Post Creation */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-4">
                    <button 
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label="Add photo"
                    >
                      <Image className="w-6 h-6" />
                    </button>
                    <button 
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label="Add video"
                    >
                      <Video className="w-6 h-6" />
                    </button>
                    <button 
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label="Add live video"
                    >
                      <PlaySquare className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{post.time}</p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex items-center gap-6 text-gray-500">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 font-medium ${
                  activeTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="min-h-[200px] bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-gray-500 text-center">No posts yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 