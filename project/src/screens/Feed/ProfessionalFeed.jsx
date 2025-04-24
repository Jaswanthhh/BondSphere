import React, { useState, useRef } from 'react';
import { MessageCircle, Heart, Bookmark, Share2, MoreHorizontal, Image, Smile, MapPin, Building2, Briefcase, DollarSign, Link } from 'lucide-react';

export const ProfessionalFeed = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileInputRef = useRef(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Google',
        avatar: 'https://logo.clearbit.com/google.com',
        role: 'Company',
        isVerified: true
      },
      content: "We're excited to announce multiple positions in our AI research team! We're looking for passionate individuals who want to shape the future of artificial intelligence.",
      time: '2h ago',
      type: 'job',
      likes: 245,
      comments: 58,
      isLiked: false,
      isBookmarked: false,
      jobDetails: {
        title: 'AI Research Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        type: 'Full-Time',
        salary: '$150k - $220k',
        tags: ['AI', 'Machine Learning', 'Python', 'Research']
      }
    },
    {
      id: 2,
      user: {
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Senior Software Engineer',
        company: 'Microsoft'
      },
      content: "Just published a comprehensive guide on modern React patterns and best practices. Check it out if you're looking to level up your React skills! 🚀",
      image: 'https://source.unsplash.com/random/800x400/?coding',
      likes: 182,
      comments: 43,
      time: '4h ago',
      isLiked: true,
      isBookmarked: true
    }
  ]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      user: {
        name: 'Current User',
        avatar: '/avatars/default.jpg',
        role: 'Software Developer',
        company: 'Tech Corp'
      },
      content: newPost,
      likes: 0,
      comments: 0,
      time: 'Just now',
      isLiked: false,
      isBookmarked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedMedia(null);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleBookmark = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0" />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with your professional network..."
                className="w-full border border-gray-200 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                  />
                  <button type="button" className="p-2 text-gray-500 hover:text-blue-500 transition-colors" onClick={() => fileInputRef.current?.click()}>
                    <Image className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100">
                {post.user.avatar && (
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=random`;
                    }}
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                  {post.user.isVerified && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {post.user.role}
                  {post.user.company && ` at ${post.user.company}`} • {post.time}
                </p>
              </div>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <p className="text-gray-800 mb-4">{post.content}</p>
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Job Details if post type is job */}
          {post.type === 'job' && post.jobDetails && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-lg mb-2">{post.jobDetails.title}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{post.jobDetails.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{post.jobDetails.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{post.jobDetails.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>{post.jobDetails.salary}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.jobDetails.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                } transition-colors`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => toggleBookmark(post.id)}
              className={`p-2 ${
                post.isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
              } transition-colors`}
            >
              <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 