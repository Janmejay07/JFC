import React, { useState, useEffect } from "react";
import { Calendar, Trophy, MapPin, ArrowLeft, AlertCircle } from "lucide-react";
import axios from "axios";
import { SectionLoading } from "./ui/Loading";
import { API_ENDPOINTS } from "../lib/config";

const CompletedMatchesSection = () => {
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchCompletedMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(API_ENDPOINTS.MATCHES);
      
      if (!Array.isArray(response.data)) {
        throw new Error('Server response is not a valid array of matches.');
      }

      const sortedMatches = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setCompletedMatches(sortedMatches);

    } catch (err) {
      let errorMessage = 'Failed to fetch completed matches.';
      
      if (err.response) {
        errorMessage = `Server responded with status ${err.response.status}.`;
      } else if (err.request) {
        errorMessage = 'Network error: No response received from server. Is the backend running?';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setCompletedMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedMatches();
  }, []);

  const handleMatchClick = (match) => {
    if (match && match._id) {
      setSelectedMatch(match);
    }
  };

  const handleBackToList = () => {
    setSelectedMatch(null);
  };

  const handleRetry = () => {
    setError(null);
    fetchCompletedMatches();
  };

  // Loading state
  if (loading) {
    return (
      <SectionLoading 
        variant="dark" 
        message="Loading completed matches..." 
      />
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Matches</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Display a detailed view for a selected match
  if (selectedMatch) {
    return (
      <section className="py-12 px-4 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Go Back to List
          </button>
          <div className="bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-gray-200">
              {selectedMatch.homeTeam || 'Home'} {selectedMatch.jfcScore || 0} - {selectedMatch.opponentScore || 0} {selectedMatch.awayTeam || 'Away'}
            </h3>
            <div className="flex items-center gap-4 mt-4 text-gray-300">
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                {selectedMatch.date ? new Date(selectedMatch.date).toLocaleDateString() : 'Date not available'}
              </span>
              <span className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                {selectedMatch.venue || 'Venue not available'}
              </span>
            </div>
            
            {selectedMatch.mvp && (
              <div className="mt-4">
                <span className="text-gray-400">MVP: </span>
                <span className="font-semibold text-yellow-400">{selectedMatch.mvp}</span>
              </div>
            )}

            <div className="mt-8 space-y-6">
              <div>
                <h4 className="text-2xl font-bold text-white mb-4">Lineup</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-xl font-semibold text-blue-400 mb-2">{selectedMatch.homeTeam || 'Home Team'}</h5>
                    <ul className="text-gray-300 space-y-1">
                      {selectedMatch.jfcLineup && selectedMatch.jfcLineup.length > 0 ? (
                        selectedMatch.jfcLineup.map((player, index) => (
                          <li key={index}>
                            {player.name || 'Unknown Player'} 
                            {player.position && ` (${player.position})`}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No lineup available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xl font-semibold text-emerald-400 mb-2">{selectedMatch.awayTeam || 'Away Team'}</h5>
                    <ul className="text-gray-300 space-y-1">
                      {selectedMatch.opponentLineup && selectedMatch.opponentLineup.length > 0 ? (
                        selectedMatch.opponentLineup.map((player, index) => (
                          <li key={index}>
                            {player.name || 'Unknown Player'} 
                            {player.position && ` (${player.position})`}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No lineup available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Display the list of completed matches
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
            Completed Matches
          </h3>
        </div>

        {completedMatches.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No completed matches to display.</p>
            <button
              onClick={handleRetry}
              className="mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {completedMatches.map((match) => {
              if (!match || !match._id) {
                return null;
              }
              
              return (
                <div
                  key={match._id}
                  onClick={() => handleMatchClick(match)}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm transform group-hover:scale-[1.02] transition duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h4 className="text-xl font-bold text-gray-200">
                          {match.homeTeam || 'Home'} {match.jfcScore || 0} - {match.opponentScore || 0} {match.awayTeam || 'Away'}
                        </h4>
                        {match.mvp && (
                          <div className="text-sm text-gray-400 mt-1">
                            MVP: <span className="font-semibold text-yellow-400">{match.mvp}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4 text-gray-300">
                        <span className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                          {match.date ? new Date(match.date).toLocaleDateString() : 'Date not available'}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                          {match.venue || 'Venue not available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompletedMatchesSection;