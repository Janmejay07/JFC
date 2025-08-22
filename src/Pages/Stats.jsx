import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  endOfWeek,
  format,
  isWithinInterval,
} from "date-fns";
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

  // ✅ FIXED: Production-ready stats update function
  const handleUpdateStats = async (updatedPlayer) => {
    try {
      // Use _id for MongoDB or id for other databases
      const playerId = updatedPlayer._id || updatedPlayer.id;
      
      const response = await fetch(
        `${API_ENDPOINTS.UPDATE_PLAYER_STATS}/${playerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Only add Authorization header if token exists
            ...(localStorage.getItem("token") && {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }),
          },
          body: JSON.stringify({ s: updatedPlayer.s }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      // Update local state only after successful server update
      setPlayers((prev) =>
        prev.map((p) =>
          (p._id || p.id) === playerId ? { ...p, s: updatedPlayer.s } : p
        )
      );

      // Clear any previous errors
      setError(null);

    } catch (err) {
      setError(err.message || "Failed to update player stats. Please try again.");
    }
  };

  useEffect(() => {
    const checkAndUpdateSeason = () => {
      const now = new Date();
      const nextSeasonStart = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
      if (now >= nextSeasonStart) {
        setPreviousSeasonPlayers(players);
        setPreviousWinners({
          mvp: weeklyMVP,
          topScorer: weeklyTopScorer,
        });
        setWeeklyMVP(null);
        setWeeklyTopScorer(null);
        setPlayers((prev) =>
          prev.map((player) => ({ ...player, achievements: [] }))
        );
        setCurrentSeason((prev) => prev + 1);
        setSeasonStartDate(nextSeasonStart);
      }
    };

    checkAndUpdateSeason();
    const intervalId = setInterval(checkAndUpdateSeason, 1000 * 60 * 60 * 24);
    return () => clearInterval(intervalId);
  }, [seasonStartDate, players, weeklyMVP, weeklyTopScorer]);

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
        const res = await fetch(API_ENDPOINTS.STANDINGS);
        if (!res.ok) throw new Error("Failed to fetch player data");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid API response format");

        const playersWithAchievements = calculateAchievements(
          data.map((p) => ({ ...p, s: p.s || 0 }))
        );
        setPlayers(playersWithAchievements);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [currentSeason, previousSeasonPlayers]);

  // ✅ FIXED: Weekly stats calculation (removed lastUpdated dependency since it's not in your schema)
  useEffect(() => {
    const calculateWeeklyStats = () => {
      if (!players.length) {
        setWeeklyMVP(null);
        setWeeklyTopScorer(null);
        return;
      }

      // Since your schema doesn't have lastUpdated, calculate weekly stats differently
      // You could use all players for weekly stats or implement a different filtering logic
      const topScorer = players.reduce((a, b) => (b.g > a.g ? b : a));
      const mvp = players.reduce((a, b) => (b.pt > a.pt ? b : a));
      
      setWeeklyTopScorer(topScorer.g > 0 ? topScorer : null);
      setWeeklyMVP(mvp.pt > 0 ? mvp : null);
    };
    calculateWeeklyStats();
  }, [players]);

  const calculateAchievements = (currentPlayers) => {
    if (!currentPlayers.length) return [];
    const maxGoals = Math.max(...currentPlayers.map((p) => p.g || 0));
    const maxGames = Math.max(...currentPlayers.map((p) => p.p || 0));
    const maxSaves = Math.max(...currentPlayers.map((p) => p.s || 0));
    return currentPlayers.map((player) => {
      const ach = [];
      if (player.g === maxGoals && maxGoals > 0) ach.push("Top Scorer");
      if (player.p === maxGames && maxGames > 0) ach.push("Most Consistent");
      if (player.s === maxSaves && maxSaves > 0 && player.w / player.p > 0.6)
        ach.push("Best Defender");
      return { ...player, achievements: ach };
    });
  };

  const getPlayerRating = (pt) => {
    if (pt == null) return 0;
    return Number(((pt / 50) * 10).toFixed(1));
  };

  const getTopPerformer = () =>
    players.length
      ? players.reduce((a, b) => (b.pt > a.pt ? b : a))
      : null;

  const getTopScorer = () =>
    players.length
      ? players.reduce((a, b) => (b.g > a.g ? b : a))
      : null;

  const formatSeasonDates = () => {
    const start = new Date(
      seasonStartDate.getFullYear(),
      seasonStartDate.getMonth(),
      1
    );
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
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

  // ✅ ADDED: Loading state with Tailwind styling (matching your app theme)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 space-y-4">
        <div className="w-60">
          <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full animate-indeterminate"
              style={{ width: "40%" }}
            ></div>
          </div>
        </div>
        <p className="text-indigo-600 text-lg font-semibold">Loading player standings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center text-red-600 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const seasonDates = formatSeasonDates();
  const weeklyDates = formatWeeklyDates();
  const topPlayer = getTopPerformer();
  const topScorer = getTopScorer();

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
