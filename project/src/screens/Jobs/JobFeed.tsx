import React, { useState, useRef } from 'react';
import { Image, Link, Smile, Send, ThumbsUp, MessageCircle, Share2, Bookmark, Building2, Briefcase, MapPin, DollarSign, X } from 'lucide-react';

interface JobPost {
  id: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  timestamp: Date;
  type: 'knowledge' | 'job' | 'update';
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  jobDetails?: {
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    tags: string[];
  };
}

export const JobFeed = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<JobPost[]>([
    {
      id: '1',
      author: {
        name: 'Google',
        role: 'Company',
        avatar: 'https://logo.clearbit.com/google.com',
        isVerified: true
      },
      content: "We're excited to announce multiple positions in our AI research team! We're looking for passionate individuals who want to shape the future of artificial intelligence.",
      timestamp: new Date(),
      type: 'job',
      likes: 245,
      comments: 58,
      shares: 124,
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
      id: '2',
      author: {
        name: 'Sarah Wilson',
        role: 'Senior Software Engineer',
        company: 'Microsoft',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: "Just published a comprehensive guide on modern React patterns and best practices. Check it out if you're looking to level up your React skills! 🚀",
      timestamp: new Date(),
      type: 'knowledge',
      images: ['https://source.unsplash.com/random/800x400/?coding'],
      likes: 182,
      comments: 43,
      shares: 76,
      isLiked: true,
      isBookmarked: true
    }
  ]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: JobPost = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        role: 'Software Developer',
        company: 'Tech Corp',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      content: newPost,
      timestamp: new Date(),
      type: 'knowledge',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (postId: string) => {
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

  const toggleBookmark = (postId: string) => {
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

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
                  {selectedMedia.type.startsWith('image/') ? (
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

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    {post.author.isVerified && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {post.author.role}
                    {post.author.company && ` at ${post.author.company}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(post.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={post.isBookmarked ? "Remove bookmark" : "Bookmark post"}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    post.isBookmarked ? "text-blue-500 fill-current" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
              {post.images && post.images.length > 0 && (
                <div className="mt-4">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="rounded-xl w-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Job Details if post type is job */}
            {post.type === 'job' && post.jobDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
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
            <div className="mt-4 flex items-center justify-between pt-4 border-t">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                title={`${post.isLiked ? 'Unlike' : 'Like'} post`}
                aria-label={`${post.isLiked ? 'Unlike' : 'Like'} post - ${post.likes} likes`}
              >
                <ThumbsUp
                  className={`w-5 h-5 ${post.isLiked ? "text-blue-500 fill-current" : ""}`}
                />
                <span>{post.likes}</span>
              </button>
              <button 
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                title="Comment on post"
                aria-label={`Comment on post - ${post.comments} comments`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments}</span>
              </button>
              <button 
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                title="Share post"
                aria-label={`Share post - ${post.shares} shares`}
              >
                <Share2 className="w-5 h-5" />
                <span>{post.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 