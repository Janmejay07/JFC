import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, X, CheckCircle, Shield } from 'lucide-react';
import { ButtonLoading } from '../Components/ui/Loading';
import axios from 'axios';
import { API_ENDPOINTS } from "../lib/config"; 

const SignupForm = () => {
  // State for the initial signup form data
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', 
  });

  // State for the email verification code
  const [verificationCode, setVerificationCode] = useState('');
  
  // State to track if the user has successfully signed up (to show the next step)
  const [isSignedUp, setIsSignedUp] = useState(false);
  
  // State for messages and loading status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Function to validate the form data
  const validateForm = () => {
    // Basic validation for name (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError('Full Name must contain only letters and spaces.');
      return false;
    }

    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Password length validation
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    // Confirm password presence and match
    if (!formData.confirmPassword) {
      setError('Please confirm your password.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    setError('');
    return true;
  };

  // Handle changes for both forms
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignedUp) {
      setVerificationCode(value);
    } else {
      // Check if the changed field is 'role'
      if (name === 'role') {
        // If role is 'admin', set the email to the specific admin email.
        // Otherwise, clear the email field.
        setFormData({
          ...formData,
          [name]: value,
          email: value === 'admin' ? 'offside.jfc@gmail.com' : '',
        });
      } else {
        // For all other fields, update as normal
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  // Handle the initial signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    // Run the validation check before submitting
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        ...formData,
      });

      // On successful registration, set the state to true to show the verification form
      setSuccess(response.data.message || 'Registration successful! Please check your email for a verification code.');
      setIsSignedUp(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle the email verification form submission
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Send the username and verification code to your backend for verification
      const response = await axios.post(API_ENDPOINTS.VERIFY_EMAIL, {
        username: formData.username,
        verificationCode,
      });

      setSuccess(response.data.message || 'Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after successful verification
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Conditional rendering based on the signup status
  const renderForm = () => {
    if (isSignedUp) {
      // Render the verification code form
      return (
        <form className="space-y-6" onSubmit={handleVerificationSubmit}>
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-200">
              Verification Code
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="verification-code"
                name="verificationCode"
                type="text"
                required
                value={verificationCode}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter the code from your email"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900'
            }`}
          >
            {loading ? (
              <ButtonLoading loadingText="Verifying..." />
            ) : (
              'Verify Email'
            )}
          </button>
        </form>
      );
    } else {
      // Render the initial signup form
      return (
        <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Full Name
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
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Choose a username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                  disabled={formData.role === 'admin'}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Choose a strong password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-200">
                Role
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900'
            }`}
          >
            {loading ? (
              <ButtonLoading loadingText="Signing up..." />
            ) : (
              'Create account'
            )}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-blue-600/20 to-emerald-400/30 pointer-events-none" />
      <div className="relative w-full max-w-md space-y-8 p-10 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-400/20">
        {/* Cross button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          {isSignedUp ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
          ) : (
            <UserPlus className="mx-auto h-12 w-12 text-blue-400" />
          )}
          <h2 className="mt-6 text-3xl font-bold text-white">
            {isSignedUp ? 'Verify Your Email' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {isSignedUp ? (
              'A verification code has been sent to your email.'
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
        {error && <div className="bg-red-500 text-white text-sm p-2 rounded-md">{error}</div>}
        {success && <div className="bg-green-500 text-white text-sm p-2 rounded-md">{success}</div>}
        
        {renderForm()}

        <div className="text-sm text-center text-gray-400">
          By signing up, you agree to our{' '}
          <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
