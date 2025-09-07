import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import MatchesSection from "../Components/CompleteMatches";
import UpcomingMatchesSection from "../Pages/UpcomingMatchesSection";
import { FullPageLoading } from "../Components/ui/Loading";
import { API_ENDPOINTS } from "../lib/config";

function Home() {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: [],
    imageUrl: "",
  });
  const [players, setPlayers] = useState([]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          playersResponse,
          aboutResponse,
        ] = await Promise.all([
          fetch(API_ENDPOINTS.PLAYERS),
          fetch(API_ENDPOINTS.ABOUT_SECTION),
        ]);

        const [
          playersData,
          aboutDataResponse,
        ] = await Promise.all([
          playersResponse.json(),
          aboutResponse.json(),
        ]);

        setPlayers(playersData || []);
        setAboutData(aboutDataResponse || { title: "", description: [], imageUrl: "" });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Loading State
  if (!aboutData.title) {
    return (
      <FullPageLoading 
        variant="dark" 
        message="Loading JFC Homepage..." 
        showProgress={true}
      />
    );
  }
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <HeroSection /> {/* Hero Section Component */}

        {/* About Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-gray-900 to-blue-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              {aboutData.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                {aboutData.imageUrl && (
                  <img
                    src={API_ENDPOINTS.getAboutImage(aboutData.imageUrl)}
                    alt="Team"
                    className="relative rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition duration-500"
                  />
                )}
              </div>
              <div className="space-y-6">
                {aboutData.description.map((paragraph, index) => (
                  <p key={index} className="text-xl text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Squad Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-16">
              <Users className="w-10 h-10 text-blue-400" />
              <h2 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Our Squad
              </h2>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-x-auto">
              <div className="flex gap-8">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="relative h-[28rem] group w-64 flex-shrink-0"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative h-full rounded-lg overflow-hidden">
                      {player.image && (
                        <img
                          src={API_ENDPOINTS.getPlayerImage(player.image)}
                          alt={player.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            {player.name}
                          </h3>
                          <p className="text-xl text-gray-300 mb-2">
                            {player.position}
                          </p>
                          <p className="text-2xl font-bold text-blue-400">
                            #{player.number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Matches Section */}
        <MatchesSection />

        {/* Upcoming Matches Section */}
        <UpcomingMatchesSection />
      </div>
      <Footer />
    </div>
  );
}

export default Home;