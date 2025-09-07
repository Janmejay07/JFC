import React, { useState, useEffect } from 'react';
import { Mail, User, UserPlus, Shield, Camera, Edit, Calendar, MapPin } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { FullPageLoading } from './ui/Loading';
import { API_ENDPOINTS } from "../lib/config";
import axios from "axios";

export function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  // Function to handle fetching the user profile from the backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      
      const response = await axios.get(API_ENDPOINTS.PROFILE, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Ensure all fields are properly set with defaults
      const completeUserData = {
        _id: response.data._id || '',
        name: response.data.name || '',
        username: response.data.username || '',
        email: response.data.email || '',
        role: response.data.role || 'user',
        gender: response.data.gender || '',
        dob: response.data.dob || '',
        favoritePosition: response.data.favoritePosition || '',
        avatarUrl: response.data.avatarUrl || '',
        createdAt: response.data.createdAt || '',
        updatedAt: response.data.updatedAt || ''
      };
      
      setUserData(completeUserData);
      setUpdatedData(completeUserData);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Form validation function
  const validateForm = () => {
    const errors = [];
    
    if (!updatedData.name || updatedData.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!updatedData.username || updatedData.username.trim() === '') {
      errors.push('Username is required');
    }
    
    if (updatedData.dob) {
      const dobDate = new Date(updatedData.dob);
      const today = new Date();
      
      if (isNaN(dobDate.getTime())) {
        errors.push('Invalid date format for date of birth');
      } else if (dobDate > today) {
        errors.push('Date of birth cannot be in the future');
      }
    }
    
    return errors;
  };

  // Handler for updating the form data in editing mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dob') {
      if (value === '') {
        setUpdatedData({ ...updatedData, [name]: '' });
      } else {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          setUpdatedData({ ...updatedData, [name]: value });
        }
      }
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };

  // Handler for the image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setUpdatedData({ ...updatedData, avatarUrl: previewUrl });
      setError(null);
    }
  };

  // Handler for saving profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Include ALL profile fields
      formData.append('name', updatedData.name || '');
      formData.append('username', updatedData.username || '');
      formData.append('role', updatedData.role || '');
      formData.append('gender', updatedData.gender || '');
      formData.append('favoritePosition', updatedData.favoritePosition || '');
      
      if (updatedData.dob && updatedData.dob.trim() !== '') {
        const dobDate = new Date(updatedData.dob);
        if (!isNaN(dobDate.getTime())) {
          formData.append('dob', dobDate.toISOString());
        }
      }
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.patch(`${API_ENDPOINTS.PROFILE}/${userData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditing(false);
      setProfileImage(null);
      
      if (updatedData?.avatarUrl && updatedData.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(updatedData.avatarUrl);
      }
      
      // Fetch fresh complete data from backend
      await fetchUserProfile();
      
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handler for canceling edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedData(userData);
    setProfileImage(null);
    setError(null);
    
    if (updatedData?.avatarUrl && updatedData.avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(updatedData.avatarUrl);
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <FullPageLoading 
        variant="dark" 
        message="Loading complete profile..." 
      />
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <div className="text-center max-w-md">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
          >
            Retry Loading Profile
          </button>
          <div className="text-sm text-gray-400">
            <p>Debug info:</p>
            <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
            <p>API Endpoint: {API_ENDPOINTS.PROFILE}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">No profile data available</p>
          <button 
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load Complete Profile
          </button>
        </div>
      </div>
    );
  }

  const firstLetter = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U';
  const displayData = isEditing ? updatedData : userData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col font-inter">
      <Navbar />
      <div className="h-40 bg-gradient-to-r from-blue-400 via-blue-600 to-emerald-400"></div>
      <div className="relative px-8 pb-8 flex-grow">
        
        <div className="flex flex-col items-center -mt-12">
          {/* Avatar and Image Upload */}
          <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600">
            {displayData?.avatarUrl ? (
              <img
                src={displayData.avatarUrl}
                alt={displayData?.name || 'User Avatar'}
                className="w-36 h-36 rounded-full border-4 border-gray-900 shadow-xl object-cover"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center bg-blue-500 text-white font-bold text-2xl rounded-full">
                {firstLetter}
              </div>
            )}
            {isEditing && (
              <label htmlFor="profile-image-upload" className="absolute bottom-4 right-4 p-2 bg-blue-500 rounded-full text-white cursor-pointer hover:bg-blue-600 transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Complete Profile Details Section */}
        <div className="mt-8 max-w-4xl mx-auto space-y-8 p-10 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-400/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Complete Profile Details</h2>
            <button 
              onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)} 
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              disabled={loading}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {isEditing ? (
              // Editable form with ALL fields
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={updatedData?.name || ''}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                      Username <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserPlus className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={updatedData?.username || ''}
                        onChange={handleInputChange}
                        disabled // Username is now uneditable
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none sm:text-sm cursor-not-allowed"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={updatedData?.email || ''}
                        onChange={handleInputChange}
                        disabled
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none sm:text-sm cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-200">Role</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        value={updatedData?.role || 'user'}
                        onChange={handleInputChange}
                        disabled // Role is now uneditable
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-400 focus:outline-none sm:text-sm cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-200">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={updatedData?.gender || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-200">Date of Birth</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formatDateForInput(updatedData?.dob)}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="favoritePosition" className="block text-sm font-medium text-gray-200">Favorite Position</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="favoritePosition"
                        name="favoritePosition"
                        type="text"
                        value={updatedData?.favoritePosition || ''}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Midfielder, Forward, Goalkeeper"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Complete Profile...
                    </span>
                  ) : (
                    'Save All Changes'
                  )}
                </button>
              </>
            ) : (
              // Display mode - Show ALL profile fields
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Full Name</label>
                    <p className="mt-1 text-white text-lg font-semibold">{userData?.name || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Username</label>
                    <p className="mt-1 text-white text-lg">@{userData?.username || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email Address</label>
                    <p className="mt-1 text-white text-lg break-all">{userData?.email || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Role</label>
                    <div className="mt-1 flex items-center">
                      <Shield className="w-5 h-5 text-blue-400 mr-2" />
                      <p className="text-white text-lg capitalize">{userData?.role || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Gender</label>
                    <p className="mt-1 text-white text-lg capitalize">{userData?.gender || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Date of Birth</label>
                    <div className="mt-1 flex items-center">
                      <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                      <p className="text-white text-lg">{formatDateForDisplay(userData?.dob)}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-400">Favorite Position</label>
                    <div className="mt-1 flex items-center">
                      <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                      <p className="text-white text-lg">{userData?.favoritePosition || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Account Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Member Since</label>
                    <p className="mt-1 text-gray-300 text-sm">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not available'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Last Updated</label>
                    <p className="mt-1 text-gray-300 text-sm">
                      {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;