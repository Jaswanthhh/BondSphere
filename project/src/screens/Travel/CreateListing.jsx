import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import PropTypes from 'prop-types';
import { travelApi } from '../../services/api';

/**
 * CreateListing component for creating new travel listings
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the create listing modal
 * @param {Function} props.onSubmit - Function to submit the new listing
 */
export const CreateListing = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',  
    endDate: '',
    type: 'flight',
    maxParticipants: 1,
    description: '',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', // Default image
    interests: []
  });

  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    // Format dates for display
    const dates = `${new Date(formData.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${new Date(formData.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;

    try {
      // Remove MongoDB fields if present
      const { _id, createdAt, __v, ...cleanData } = formData;
      const res = await travelApi.createListing({
        ...cleanData,
        dates
      });
      onSubmit(res.data); // Pass backend response to parent
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create listing');
    }
    setLoading(false);
  };

  const addInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()]
      });
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Travel Listing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close create listing form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter trip title"
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="Enter destination"
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Travel Type
              </label>
              <select
                id="type"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="road">Road Trip</option>
                <option value="cruise">Cruise</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <input
                id="maxParticipants"
                type="number"
                required
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value, 10) })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your trip"
              minLength={10}
              maxLength={1000}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              id="image"
              type="url"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Enter image URL"
              pattern="https?://.+"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests/Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-sm flex items-center gap-1"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="Add interests (e.g., Photography, Culture)"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

CreateListing.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}; 