import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Change if your backend URL is different

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  },
  withCredentials: true,
});

// Add JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      window.location.href = '/'; // Force a full page reload to clear state
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData, {
    headers: {
      'Content-Type': 'application/json'
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    }
  }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
};

// User endpoints
export const users = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return api.put('/users/me', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      return api.put('/users/me', data);
    }
  },
  getAllUsers: (search = '') => api.get(`/users/discover${search ? `?search=${search}` : ''}`),
  sendFriendRequest: (userId) => api.post('/users/friend-request', { targetUserId: userId }),
  acceptFriendRequest: (userId) => api.post('/users/friend-request/accept', { requestUserId: userId }),
  rejectFriendRequest: (userId) => api.post('/users/friend-request/reject', { requestUserId: userId }),
  getFriendRequests: () => api.get('/users/friend-requests'),
  getFriends: () => api.get('/users/friends'),
  deleteAccount: () => api.delete('/users/me'),
  getJobProfile: () => api.get('/users/job-profile'),
  updateJobProfile: (data) => {
    if (data instanceof FormData) {
      return api.put('/users/job-profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      return api.put('/users/job-profile', data);
    }
  },
};

// Community endpoints
export const communities = {
  getAll: () => api.get('/community'),
  getOne: (communityId) => api.get(`/community/${communityId}`),
  create: (data) => api.post('/community', data),
  update: (communityId, data) => api.put(`/community/${communityId}`, data),
  delete: (communityId) => api.delete(`/community/${communityId}`),
  join: (id) => api.post(`/community/${id}/join`),
  leave: (id) => api.post(`/community/${id}/leave`),
  getMembers: (communityId) => api.get(`/community/${communityId}/members`)
};

// Post endpoints
export const postsApi = {
  getAll: () => api.get('/posts'),
  createPost: (formData) => api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  comment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting post' };
    }
  },
};

// Notification endpoints
export const notifications = {
  getAll: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count')
};

export const connectionsApi = {
  getConnections: () => api.get('/users/connections'),
  sendInvite: (id) => api.post(`/users/connections/invite/${id}`),
  removeConnection: (id) => api.delete(`/users/connections/${id}`),
};

export const connectionRequestsApi = {
  getRequests: () => api.get('/users/connection-requests'),
  acceptRequest: (id) => api.post(`/users/friend-requests/${id}/accept`),
  rejectRequest: (id) => api.post(`/users/friend-requests/${id}/reject`),
};

export const chatApi = {
  getContacts: () => api.get('/users/chat/contacts'),
  getMessages: (contactId) => api.get(`/chat/messages/${contactId}`),
  sendMessage: (contactId, message) => api.post(`/chat/messages/${contactId}`, { message }),
};

export const jobFeedApi = {
  getFeed: () => api.get('/job-feed'),
  createPost: (data) => api.post('/job-feed', data),
  toggleLike: (postId) => api.post(`/job-feed/${postId}/like`),
  toggleBookmark: (postId) => api.post(`/job-feed/${postId}/bookmark`),
};

export const jobsApi = {
  getJobs: () => api.get('/jobs'),
  getJob: (jobId) => api.get(`/jobs/${jobId}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (jobId, data) => api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
  bookmark: (jobId) => api.post(`/jobs/${jobId}/bookmark`),
  unbookmark: (jobId) => api.delete(`/jobs/${jobId}/bookmark`),
};

export const communityChatApi = {
  getMessages: (communityId) => api.get(`/community/${communityId}/chat/messages`),
  sendMessage: (communityId, message) => api.post(`/community/${communityId}/chat/messages`, { message }),
};

export const travelApi = {
  getListings: () => api.get('/listings'),
  getListingDetails: (listingId) => api.get(`/listings/${listingId}`),
  createListing: (data) => api.post('/listings', data),
  joinTrip: (listingId) => api.post(`/listings/${listingId}/join`),
  deleteListing: (listingId) => api.delete(`/listings/${listingId}`),
};

export const locationApi = {
  getCurrentLocation: () => api.get('/location/current'),
  shareLocation: (data) => api.post('/location/share', data),
  getSharedLocations: () => api.get('/location/shared'),
  getContacts: () => api.get('/location/contacts'),
  updateLocation: (data) => api.post('/location/update', data),
};

export const storiesApi = {
  getAll: () => api.get('/stories'),
  create: (formData) => api.post('/stories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Messages API
export const messagesApi = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (data) => api.post('/messages', data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`)
};

export { communities as communitiesApi };

export default api; 