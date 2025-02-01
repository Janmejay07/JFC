import { useState, useEffect } from "react";
import { startOfWeek, endOfWeek, format } from "date-fns";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { StatsHeader } from "../Components/StatsHeader";
import { SeasonLeaders } from "../Components/SeasonLeaders";
import { WeeklyLeaders } from "../Components/WeeklyLeaders";
import { PlayerStatsTable } from "../Components/PlayerStatsTable";
import { StatsGuide } from "../Components/StatsGuide";
import { API_ENDPOINTS } from "../lib/config";  

function Stats() {
  const [players, setPlayers] = useState([]);
  const [previousSeasonPlayers, setPreviousSeasonPlayers] = useState([]);
  const [previousWinners, setPreviousWinners] = useState({
    mvp: null,
    topScorer: null,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [weeklyMVP, setWeeklyMVP] = useState(null);
  const [weeklyTopScorer, setWeeklyTopScorer] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [seasonStartDate, setSeasonStartDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUpdateStats = (updatedPlayer) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.map((p) =>
        p.player === updatedPlayer.player
          ? { ...p, s: updatedPlayer.s } // Updating saves
          : p
      );
      return newPlayers;
    });
  };

  useEffect(() => {
    const checkAndUpdateSeason = () => {
      const now = new Date();
      const nextSeasonStart = new Date(now.getFullYear(), now.getMonth() + 1, 1); // 1st of next month
    
      if (now >= nextSeasonStart) {
        setPreviousSeasonPlayers(players);
        setPreviousWinners({
          mvp: weeklyMVP,
          topScorer: weeklyTopScorer,
        });
    
        // Reset MVP, Top Scorer, and Achievements
        setWeeklyMVP(null);
        setWeeklyTopScorer(null);
    
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({ ...player, achievements: [] }))
        );
    
        setCurrentSeason((prev) => prev + 1);
        setSeasonStartDate(nextSeasonStart);
      }
    };
    
    

    checkAndUpdateSeason();
    const intervalId = setInterval(checkAndUpdateSeason, 1000 * 60 * 60 * 24);
    return () => clearInterval(intervalId);
  }, [seasonStartDate, players]);

  useEffect(() => {
    const checkAdminStatus = () => {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      setIsAdmin(storedUser.isAdmin || false);
    };

    checkAdminStatus();
    window.addEventListener("storage", checkAdminStatus);
    return () => window.removeEventListener("storage", checkAdminStatus);
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.STANDINGS);
        if (!response.ok) {
          throw new Error("Failed to fetch player data");
        }
        const data = await response.json();

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Ensure saves exist in the API response
        const playersWithAchievements = calculateAchievements(
          data.map((player) => ({
            ...player,
            s: player.s || 0, // Default to 0 if missing
          })),
          previousSeasonPlayers
        );

        setPlayers(playersWithAchievements);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [currentSeason, previousSeasonPlayers]);

  useEffect(() => {
    const calculateWeeklyStats = () => {
      if (!players.length) {
        setWeeklyMVP(null);
        setWeeklyTopScorer(null);
        return;
      }

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      const weeklyPlayers = players.filter(
        (player) =>
          player.lastUpdated &&
          isWithinInterval(new Date(player.lastUpdated), {
            start: weekStart,
            end: weekEnd,
          })
      );

      if (!weeklyPlayers.length) {
        setWeeklyMVP(null);
        setWeeklyTopScorer(null);
        return;
      }

      const weeklyTopScorer = weeklyPlayers.reduce(
        (prev, current) => (current.g > prev.g ? current : prev),
        weeklyPlayers[0]
      );

      const weeklyMVP = weeklyPlayers.reduce(
        (prev, current) => (current.pt > prev.pt ? current : prev),
        weeklyPlayers[0]
      );

      setWeeklyTopScorer(weeklyTopScorer.g > 0 ? weeklyTopScorer : null);
      setWeeklyMVP(weeklyMVP.pt > 0 ? weeklyMVP : null);
    };

    calculateWeeklyStats();
  }, [players]);

  const calculateAchievements = (currentPlayers) => {
    if (!currentPlayers.length) return [];
  
    const maxGoals = Math.max(...currentPlayers.map((p) => p.g || 0));
    const maxMatches = Math.max(...currentPlayers.map((p) => p.p || 0));
    const maxSaves = Math.max(...currentPlayers.map((p) => p.s || 0));
  
    return currentPlayers.map((player) => {
      const achievements = [];
  
      if (player.g === maxGoals && maxGoals > 0) {
        achievements.push("Top Scorer");
      }
  
      if (player.p === maxMatches && maxMatches > 0) {
        achievements.push("Most Consistent");
      }
  
      if (player.w / player.p > 0.6 && player.s === maxSaves && maxSaves > 0) {
        achievements.push("Best Defender");
      }
  
      return { ...player, achievements };
    });
  };

  const getPlayerRating = (pt) => {
    if (pt == null) return 0;
    return Number(((pt / 50) * 10).toFixed(1));
  };

  const getTopPerformer = () => {
    if (!players.length) return null;
    return players.reduce(
      (prev, current) => (current.pt > prev.pt ? current : prev),
      players[0]
    );
  };

  const getTopScorer = () => {
    if (!players.length) return null;
    return players.reduce(
      (prev, current) => (current.g > prev.g ? current : prev),
      players[0]
    );
  };

  const formatSeasonDates = () => {
    const start = new Date(seasonStartDate.getFullYear(), seasonStartDate.getMonth(), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Last day of the month
  
    return {
      start: format(start, "MMMM dd, yyyy"),
      end: format(end, "MMMM dd, yyyy"),
    };
  };


  const formatWeeklyDates = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    return {
      start: format(weekStart, "MMMM dd, yyyy"),
      end: format(weekEnd, "MMMM dd, yyyy"),
    };
  };

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-600">
        Loading player standings...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-12 text-red-600">Error: {error}</div>;
  }

  const seasonDates = formatSeasonDates();
  const weeklyDates = formatWeeklyDates();
  const topScorer = getTopScorer();
  const topPlayer = getTopPerformer();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <StatsHeader
            currentSeason={currentSeason}
            seasonDates={seasonDates}
            weeklyDates={weeklyDates}
          />

          <SeasonLeaders
            currentSeason={currentSeason}
            topPlayer={topPlayer}
            topScorer={topScorer}
          />

          <WeeklyLeaders
            weeklyMVP={weeklyMVP}
            weeklyTopScorer={weeklyTopScorer}
            weeklyDates={weeklyDates}
          />

          <PlayerStatsTable
            players={players}
            onUpdateStats={handleUpdateStats}
            getPlayerRating={getPlayerRating}
            isAdmin={isAdmin}
          />

          <StatsGuide />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Stats;
