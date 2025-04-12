import React, { useState, useRef } from 'react';
import { Image, Video, PlaySquare, Heart, MessageCircle, Share2, MoreHorizontal, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: number;
  user: {
    name: string;
    avatar: string;
    time?: string;
  };
  media: {
    type: 'image' | 'video';
    url: string;
  };
  viewed?: boolean;
}

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    time: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  commentsList: {
    id: number;
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    likes?: number;
    isLiked?: boolean;
  }[];
}

export const Feed = (): JSX.Element => {
  const [postContent, setPostContent] = useState('');
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [selectedStoryMedia, setSelectedStoryMedia] = useState<File | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);
  const [stories, setStories] = useState<Story[]>([
    {
      id: 1,
      user: {
        name: 'Jimmy Maxwell',
        avatar: 'https://i.pravatar.cc/150?img=1',
        time: '12 April at 09:28 PM'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba'
      }
    },
    {
      id: 2,
      user: {
        name: 'Joshua Hunt',
        avatar: 'https://i.pravatar.cc/150?img=2',
        time: '12 April at 09:28 PM'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1682687221038-404670f09727'
      }
    },
    {
      id: 3,
      user: {
        name: 'Danny Moore',
        avatar: 'https://i.pravatar.cc/150?img=3',
        time: '12 April at 09:28 PM'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba'
      }
    },
    {
      id: 4,
      user: {
        name: 'Jason Gutierrez',
        avatar: 'https://i.pravatar.cc/150?img=4',
        time: '12 April at 09:28 PM'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1682687221038-404670f09727'
      }
    }
  ]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'John Busten',
        avatar: 'https://i.pravatar.cc/150?img=5',
        time: '12 April at 09:28 PM'
      },
      content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.\n-Nelson Mandela',
      likes: 120000,
      comments: 25,
      shares: 231,
      isLiked: false,
      commentsList: [
        {
          id: 1,
          user: {
            name: 'Lucas West',
            avatar: 'https://i.pravatar.cc/150?img=6'
          },
          content: 'My all time favorite quote ❤️',
          likes: 5,
          isLiked: false
        }
      ]
    },
    {
      id: 2,
      user: {
        name: 'Sarah Parker',
        avatar: 'https://i.pravatar.cc/150?img=7',
        time: '12 April at 08:15 PM'
      },
      content: 'Just finished setting up my new workspace! 🎨✨',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d'
      },
      likes: 845,
      comments: 32,
      shares: 12,
      isLiked: false,
      commentsList: [
        {
          id: 1,
          user: {
            name: 'Emma Wilson',
            avatar: 'https://i.pravatar.cc/150?img=8'
          },
          content: 'Love the setup! Where did you get that desk lamp? 😍',
          likes: 3,
          isLiked: false
        }
      ]
    }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  const handleStoryFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedStoryMedia(file);
      handleCreateStory(file);
    }
  };

  const handleCreateStory = async (file: File) => {
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    const mediaUrl = URL.createObjectURL(file);

    const newStory: Story = {
      id: stories.length + 1,
      user: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=12',
        time: 'Just now'
      },
      media: {
        type: mediaType,
        url: mediaUrl
      }
    };

    setStories([newStory, ...stories]);
    setSelectedStoryMedia(null);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !selectedMedia) return;

    let mediaData = undefined;
    if (selectedMedia) {
      const mediaType = selectedMedia.type.startsWith('image/') ? 'image' as const : 'video' as const;
      const mediaUrl = URL.createObjectURL(selectedMedia);
      mediaData = {
        type: mediaType,
        url: mediaUrl
      };
    }

    const newPost: Post = {
      id: posts.length + 1,
      user: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=12',
        time: 'Just now'
      },
      content: postContent,
      media: mediaData,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      commentsList: []
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setSelectedMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleSharePost = (postId: number) => {
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

  const handleAddComment = (postId: number) => {
    if (!newComment[postId]?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: post.commentsList.length + 1,
          user: {
            name: 'You',
            avatar: 'https://i.pravatar.cc/150?img=12'
          },
          content: newComment[postId],
          likes: 0,
          isLiked: false
        };

        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [...post.commentsList, newCommentObj]
        };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: '' });
  };

  const handleLikeComment = (postId: number, commentId: number) => {
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
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                  <p className="text-sm text-gray-500">{post.user.time}</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                aria-label="More options"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-800 mb-4 whitespace-pre-line">{post.content}</p>
            {post.media && (
              <div className="mb-4 rounded-xl overflow-hidden">
                {post.media.type === 'image' ? (
                  <img
                    src={post.media.url}
                    alt="Post content"
                    className="w-full h-auto"
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
                onClick={() => handleLikePost(post.id)}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes.toLocaleString()} Likes</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments} Comments</span>
              </button>
              <button 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                onClick={() => handleSharePost(post.id)}
              >
                <Share2 className="w-5 h-5" />
                <span>{post.shares} Share</span>
              </button>
            </div>
            {/* Comments */}
            <div className="mt-4 space-y-4">
              {post.commentsList.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                      <button 
                        className={`text-sm ${comment.isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleLikeComment(post.id, comment.id)}
                      >
                        {comment.likes} likes
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
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
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
                key={story.id} 
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=S';
                  }}
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