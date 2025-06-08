import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Heart, Bookmark, Share2, MoreHorizontal, Image, Smile, MapPin, Building2, Briefcase, DollarSign, Link } from 'lucide-react';
import { feedApi } from '../../services/api';

export const ProfessionalFeed = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileInputRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await feedApi.getFeed();
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load feed.');
      }
      setLoading(false);
    };
    fetchFeed();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', newPost);
      if (selectedMedia) {
        formData.append('media', selectedMedia);
      }
      const res = await feedApi.createPost(formData);
      setPosts([res.data, ...posts]);
      setNewPost('');
      setSelectedMedia(null);
    } catch (err) {
      setError('Failed to create post.');
    }
    setLoading(false);
  };

  const toggleLike = async (postId) => {
    try {
      await feedApi.toggleLike(postId);
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
    } catch (err) {
      setError('Failed to update like.');
    }
  };

  const toggleBookmark = async (postId) => {
    try {
      await feedApi.toggleBookmark(postId);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked
          };
        }
        return post;
      }));
    } catch (err) {
      setError('Failed to update bookmark.');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  if (loading) return <div>Loading feed...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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