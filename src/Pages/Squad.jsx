import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SkillBar from "../Components/SkillBar"; // ⬅️ Import here
import { API_ENDPOINTS } from "../lib/config";
import { Users, Calendar, Award, TrendingUp, Star, Clock } from "lucide-react";

function Squad() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.PLAYER_PROFILES)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPlayers(data))
      .catch((error) => {
        console.error("Error fetching player data:", error);
        setError("Failed to load player data.");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">
            Error Loading Players
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-blue-600 text-xl font-semibold">
            Loading Squad...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-24 mb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 shadow-2xl">
              <Users className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            MY ELITE SQUAD
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Meet the extraordinary athletes who define excellence, embodying
            skill, dedication, and team spirit on every play.
          </p>
        </div>
      </div>

      {/* Squad Stats */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-black">{players.length}</div>
              <div className="text-sm text-gray-600">Active Players</div>
            </div>
            <div className="text-center">
              <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-black">87%</div>
              <div className="text-sm text-gray-600">Avg. Skill Level</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-black">15</div>
              <div className="text-sm text-gray-600">Wins This Season</div>
            </div>
            <div className="text-center">
              <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-black">4.8</div>
              <div className="text-sm text-gray-600">Team Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="space-y-8">
          {players.map((player) => (
            <div
              key={player._id}
              className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden"
            >
              <div className="md:flex">
                {/* Player Image */}
                <div className="md:w-2/5 overflow-hidden group">
                  <img
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    src={API_ENDPOINTS.getPlayerImage(player.image)}
                    alt={player.name}
                  />
                </div>

                {/* Player Details */}
                <div className="md:w-3/5 p-8 lg:p-12">
                  <h2 className="text-4xl font-black text-gray-900 mb-3">
                    {player.name}
                  </h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                      {player.position}
                    </span>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Age {player.age}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 p-6 rounded-2xl border">
                      <Calendar className="h-4 w-4 text-blue-600 mb-2" />
                      <p className="text-sm font-bold">Date of Birth</p>
                      <p className="text-lg font-black">{player.dob}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border">
                      <TrendingUp className="h-4 w-4 text-blue-600 mb-2" />
                      <p className="text-sm font-bold">Experience</p>
                      <p className="text-lg font-black">
                        {player.age - 18} years
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border mb-8">
                    <h3 className="text-xl font-black mb-2">Biography</h3>
                    <p className="text-gray-700">{player.bio}</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border">
                    <h3 className="text-xl font-black mb-4">Performance</h3>
                    {player.skills.map((skill, i) => (
                      <SkillBar
                        key={i}
                        name={skill.name}
                        percentage={skill.percentage}
                        delay={i * 200}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Squad;
