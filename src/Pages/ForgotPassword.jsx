import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeftCircle, LockKeyhole } from "lucide-react"; 
import { API_ENDPOINTS } from "../lib/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 font-inter">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-blue-600/20 to-emerald-400/30 pointer-events-none" />
      <div className="relative w-full max-w-md space-y-8 p-10 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-400/20">
        
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
          title="Go back to login"
        >
          <ArrowLeftCircle className="h-6 w-6" />
        </button>

        <div className="text-center">
          <LockKeyhole className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your email to receive a password reset link.
          </p>
        </div>
        
        {message && (
          <div className={`text-sm p-2 rounded-md ${
            message.includes("sent") ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-sm text-center text-gray-400">
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
            Remember your password? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
