import React, { useState, useRef, useEffect } from 'react';
import { Image, Link, Smile, Send, ThumbsUp, MessageCircle, Share2, Bookmark, Building2, Briefcase, MapPin, DollarSign, X } from 'lucide-react';
import { jobFeedApi } from '../../services/api';

export const JobFeed = () => {
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
        const res = await jobFeedApi.getFeed();
        setPosts(Array.isArray(res.data) ? res.data : []);
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
      const res = await jobFeedApi.createPost(formData);
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
      await jobFeedApi.toggleLike(postId);
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
      await jobFeedApi.toggleBookmark(postId);
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
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-start gap-4">
            <img
              src="https://i.pravatar.cc/150?img=4"
              alt="Current user"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                placeholder="Share your professional insights, knowledge, or job opportunities..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-h-[120px] resize-none"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              {selectedMedia && (
                <div className="relative mt-4">
                  {selectedMedia.type && selectedMedia.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(selectedMedia)}
                      alt="Selected media preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(selectedMedia)}
                      className="w-full h-64 object-cover rounded-xl"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                    onClick={() => setSelectedMedia(null)}
                    title="Remove media"
                    aria-label="Remove selected media"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    aria-label="Upload photo or video"
                  />
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    title="Add image"
                  >
                    <Image className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Add link"
                  >
                    <Link className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  disabled={!newPost.trim()}
                  title="Create post"
                  aria-label="Create post"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {(posts || []).map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-4 mb-2">
              <img
                src={(post.author && post.author.avatar) || '/default-avatar.png'}
                alt={(post.author && post.author.name) || 'User'}
                className="w-10 h-10 rounded-full"
                onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{(post.author && post.author.name) || 'User'}</span>
                  {post.author && post.author.isVerified && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">Verified</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {(post.author && post.author.role) || ''}
                  {post.author && post.author.company && <span> • {post.author.company}</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {post.timestamp ? new Date(post.timestamp).toLocaleString() : ''}
                </div>
              </div>
            </div>
            <div className="mb-3 text-gray-800">
              {post.content || ''}
            </div>
            {(post.images && post.images.length > 0) && (
              <div className="mb-3">
                {(post.images || []).map((img, idx) => (
                  <img key={idx} src={img || '/default-image.png'} alt="Post media" className="w-full rounded-xl mb-2" onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }} />
                ))}
              </div>
            )}
            {post.jobDetails && (
              <div className="bg-blue-50 rounded-xl p-4 mb-3 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <div className="font-semibold text-blue-900 text-lg mb-1">{post.jobDetails.title || 'No Title'}</div>
                  <div className="flex items-center gap-3 text-blue-700 text-sm mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>{post.jobDetails.company || 'N/A'}</span>
                    <MapPin className="w-4 h-4" />
                    <span>{post.jobDetails.location || 'N/A'}</span>
                    <Briefcase className="w-4 h-4" />
                    <span>{post.jobDetails.type || 'N/A'}</span>
                    <DollarSign className="w-4 h-4" />
                    <span>{post.jobDetails.salary || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(post.jobDetails.tags || []).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-2">
              <button
                className={`flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors ${post.isLiked ? 'font-bold text-blue-600' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes || 0}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments || 0}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{post.shares || 0}</span>
              </button>
              <button
                className={`flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors ${post.isBookmarked ? 'font-bold text-blue-600' : ''}`}
                onClick={() => toggleBookmark(post.id)}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 