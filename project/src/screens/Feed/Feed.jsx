import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, PlaySquare, Heart, MessageCircle, Share2, MoreHorizontal, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { postsApi, storiesApi } from '../../services/api';

export const Feed = () => {
  const [postContent, setPostContent] = useState('');
  const [newComment, setNewComment] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedStoryMedia, setSelectedStoryMedia] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const fileInputRef = useRef(null);
  const storyFileInputRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await postsApi.getAll();
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setPosts([]);
        setError('Failed to load posts');
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  const handleStoryFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedStoryMedia(file);
      handleCreateStory(file);
    }
  };

  const handleCreateStory = async (file) => {
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    const formData = new FormData();
    formData.append('media', file);
    formData.append('type', mediaType);
    try {
      const res = await storiesApi.create(formData);
      setStories([res.data, ...stories]);
      setSelectedStoryMedia(null);
    } catch (err) {
      setError('Failed to create story');
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !selectedMedia) return;
    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', postContent);
      if (selectedMedia) formData.append('media', selectedMedia);
      const res = await postsApi.createPost(formData);
      setPosts(prev => [res.data, ...prev]);
      setPostContent('');
      setSelectedMedia(null);
    } catch (err) {
      setError('Failed to create post');
    }
    setIsPosting(false);
  };

  const handleLikePost = async (postId) => {
    try {
      await postsApi.like(postId);
      setPosts(posts => posts.map(post => post._id === postId ? { ...post, isLiked: true, likes: post.likes + 1 } : post));
    } catch (err) {}
  };

  const handleUnlikePost = async (postId) => {
    try {
      await postsApi.unlike(postId);
      setPosts(posts => posts.map(post => post._id === postId ? { ...post, isLiked: false, likes: post.likes - 1 } : post));
    } catch (err) {}
  };

  const handleSharePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1
        };
      }
      return post;
    }));
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    try {
      const res = await postsApi.comment(postId, { content: newComment[postId] });
      setPosts(posts => posts.map(post =>
        post._id === postId
          ? { ...post, comments: [...post.comments, res.data] }
          : post
      ));
      setNewComment({ ...newComment, [postId]: '' });
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsList: post.commentsList.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.isLiked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1,
                isLiked: !comment.isLiked
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const handlePrevStory = () => {
    setCurrentStoryIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1));
  };

  const handleNextStory = () => {
    setCurrentStoryIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <div>Loading feed...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex gap-6 p-6">
      {/* Main Feed */}
      <div className="flex-1 space-y-6">
        {/* Post Creation */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Your avatar"
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-gray-700 focus:outline-none"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
            />
          </div>
          {selectedMedia && (
            <div className="relative mb-4">
              {selectedMedia.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(selectedMedia)}
                  alt="Selected media"
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
                className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                onClick={() => setSelectedMedia(null)}
                title="Remove media"
                aria-label="Remove selected media"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                aria-label="Upload photo or video"
                title="Upload photo or video"
              />
              <button 
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="w-5 h-5" />
                <span>Photo/video</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                <Video className="w-5 h-5" />
                <span>Story activity</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                <PlaySquare className="w-5 h-5" />
                <span>Live Video</span>
              </button>
            </div>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleCreatePost}
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {Array.isArray(posts) && posts.map(post => (
          <div key={post._id || post.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.user?.avatar || '/default-avatar.png'}
                  alt={post.user?.name || 'User'}
                  className="w-12 h-12 rounded-full"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.user?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">{post.user?.time || 'Just now'}</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                aria-label="More options"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
            {post.content && <p className="text-gray-800 mb-4 whitespace-pre-line">{post.content}</p>}
            {post.media && (
              <div className="mb-4 rounded-xl overflow-hidden">
                {post.media.type === 'image' ? (
                  <img
                    src={post.media.url || '/default-image.png'}
                    alt="Post content"
                    className="w-full h-auto"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                  />
                ) : (
                  <video
                    src={post.media.url}
                    className="w-full h-auto"
                    controls
                  />
                )}
              </div>
            )}
            <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
              <button 
                className={`flex items-center gap-2 ${post.isLiked ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-500`}
                onClick={() => post.isLiked ? handleUnlikePost(post._id) : handleLikePost(post._id)}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes?.toLocaleString() || 0} Likes</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments?.length || 0} Comments</span>
              </button>
              <button 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                onClick={() => handleSharePost(post._id)}
              >
                <Share2 className="w-5 h-5" />
                <span>{post.shares || 0} Share</span>
              </button>
            </div>
            {/* Comments */}
            <div className="mt-4 space-y-4">
              {Array.isArray(post.comments) && post.comments.map((comment) => (
                <div key={comment._id || comment.id} className="flex items-start gap-3">
                  <img
                    src={comment.user?.avatar || '/default-avatar.png'}
                    alt={comment.user?.name || 'User'}
                    className="w-8 h-8 rounded-full"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{comment.user?.name || 'Anonymous'}</h4>
                      <button 
                        className={`text-sm ${comment.isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleLikeComment(post._id, comment._id)}
                      >
                        {comment.likes || 0} likes
                      </button>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                </div>
              ))}
              {/* Comment Input */}
              <div className="flex items-center gap-3 mt-4">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full bg-gray-50 rounded-full px-4 py-2 pr-12 text-gray-700 focus:outline-none"
                    value={newComment[post._id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Add emoji"
                    >
                      😊
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Stories Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Friends Story</h2>
            <button className="text-blue-500 text-sm hover:underline">
              See all stories
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="file"
              ref={storyFileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleStoryFileSelect}
              aria-label="Upload story media"
              title="Upload story media"
            />
            <button 
              className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-xl transition-colors"
              onClick={() => storyFileInputRef.current?.click()}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-blue-500 font-medium">Create Your Story</span>
            </button>
            {stories.map(story => (
              <div 
                key={story._id || story.id} 
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => {
                  setCurrentStoryIndex(stories.indexOf(story));
                  setShowStoryModal(true);
                }}
              >
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className={`w-12 h-12 rounded-full ring-2 ${story.viewed ? 'ring-gray-300' : 'ring-blue-500'}`}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{story.user.name}</h3>
                  <p className="text-sm text-gray-500">{story.user.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Events</h2>
            <span className="text-sm text-gray-500">10 Events invites</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <h3 className="font-medium text-gray-900">Mike's Invitation Birthday</h3>
          </div>
        </div>

        {/* Suggested Pages */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Suggested Pages</h2>
            <button className="text-blue-500 text-sm hover:underline">
              See All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <img
                  src="https://logo.clearbit.com/sebo.studio"
                  alt="Sebo Studio"
                  className="w-8 h-8 rounded"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Sebo Studio</h3>
                <p className="text-sm text-gray-500">Digital Product Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setShowStoryModal(false)}
            aria-label="Close story"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            onClick={handlePrevStory}
            aria-label="Previous story"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            onClick={handleNextStory}
            aria-label="Next story"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={stories[currentStoryIndex].user.avatar}
                alt={stories[currentStoryIndex].user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="text-white">
                <h3 className="font-medium">{stories[currentStoryIndex].user.name}</h3>
                <p className="text-sm text-gray-300">{stories[currentStoryIndex].user.time}</p>
              </div>
            </div>
            {stories[currentStoryIndex].media.type === 'image' ? (
              <img
                src={stories[currentStoryIndex].media.url}
                alt="Story content"
                className="w-full h-[70vh] object-contain rounded-xl"
              />
            ) : (
              <video
                src={stories[currentStoryIndex].media.url}
                className="w-full h-[70vh] object-contain rounded-xl"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 