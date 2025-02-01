import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SkillBar from "../Components/SkillBar"; 
import { API_ENDPOINTS } from "../lib/config";  
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
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  }

  if (players.length === 0) {
    return <div className="text-blue-500 text-center mt-20">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 py-20 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-[20vw] font-black text-white whitespace-nowrap animate-scroll">
                MY SQUAD MY SQUAD MY SQUAD
              </span>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <h1 className="text-7xl md:text-9xl font-black text-white text-center mb-3 animate-fade-in drop-shadow-2xl">
                MY SQUAD
              </h1>
              <div className="flex justify-center items-center gap-2">
                <div className="w-12 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-24 h-2 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-12 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 gap-8">
          {players.map((player) => (
            <div
              key={player._id}
              className="bg-white backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3 relative group">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={API_ENDPOINTS.getPlayerImage(player.image)}
                    alt={player.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {player.name}
                    </h2>
                    <p className="text-yellow-400 font-semibold">
                      {player.position}
                    </p>
                  </div>
                </div>

                <div className="md:w-2/3 p-8">
                  <h2 className="text-4xl font-bold">{player.name}</h2>
                  <p className="text-lg font-semibold">{player.position}</p>
                  <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Date of Birth
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {player.dob}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium mb-1">Age</p>
                      <p className="text-lg font-bold text-gray-900">
                        {player.age} years
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Biography
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{player.bio}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Player Skills
                    </h3>
                    {player.skills.map((skill, index) => (
                      <SkillBar
                        key={index}
                        name={skill.name}
                        percentage={skill.percentage}
                        delay={index * 100}
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
