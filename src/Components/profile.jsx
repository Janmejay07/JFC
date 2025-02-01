import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { API_ENDPOINTS } from "../lib/config";  

export function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        setUserData(data);  // Assuming the response contains the full user object
      } catch (error) {
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Get the first letter of the name for the fallback image
  const firstLetter = userData?.name ? userData.name.charAt(0).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <Navbar />
      <div className="h-40 bg-gradient-to-r from-blue-400 via-blue-600 to-emerald-400"></div>
      <div className="relative px-8 pb-8 flex-grow">
        <div className="flex flex-col items-center -mt-20">
          {/* Avatar with fallback for first letter */}
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600">
            {userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt={userData?.name}
                className="w-36 h-36 rounded-full border-4 border-gray-900 shadow-xl object-cover"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center bg-blue-500 text-white font-bold text-2xl rounded-full">
                {firstLetter}
              </div>
            )}
          </div>

          <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {userData?.name}
          </h1>

          <div className="mt-4 flex items-center text-gray-300 hover:text-blue-400 transition-colors">
            <Mail className="w-5 h-5 mr-2" />
            <span>{userData?.email}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
