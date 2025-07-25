import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  endOfWeek,
  format,
  isWithinInterval,        // ← MARK: imported for weekly filtering
} from "date-fns";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { StatsHeader } from "../Components/StatsHeader";
import { SeasonLeaders } from "../Components/SeasonLeaders";
import { WeeklyLeaders } from "../Components/WeeklyLeaders";
import { PlayerStatsTable } from "../Components/PlayerStatsTable";
import { StatsGuide } from "../Components/StatsGuide";
import { API_ENDPOINTS } from "../lib/config";  // ← MARK: must include UPDATE_PLAYER_STATS

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

  // ─── UPDATED: Persist stats update to back-end ─────────────────────────────────
  const handleUpdateStats = async (updatedPlayer) => {
    try {
      // 1) Send PUT request to update the player's saves (s) on server
      const response = await fetch(
        `${API_ENDPOINTS.UPDATE_PLAYER_STATS}/${updatedPlayer.id}`,  // ← MARK: endpoint must exist
        {
          method: "PUT", // or "PATCH" per your API
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
          body: JSON.stringify({ s: updatedPlayer.s }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update player stats on server");
      }

      // 2) Only update local state if the server update succeeded
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === updatedPlayer.id ? { ...p, s: updatedPlayer.s } : p
        )
      );
    } catch (err) {
      console.error("Error updating player stats:", err);
      setError(err.message || "Failed to update player stats. Please try again.");
    }
  };
  // ──────────────────────────────────────────────────────────────────────────────

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
          data.map((p) => ({ ...p, s: p.s || 0 })),
          previousSeasonPlayers
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

      const weeklyPlayers = players.filter((player) =>
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
      const topScorer = weeklyPlayers.reduce((a, b) =>
        b.g > a.g ? b : a
      );
      const mvp = weeklyPlayers.reduce((a, b) =>
        b.pt > a.pt ? b : a
      );
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

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-600">
        Loading player standings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-12 text-red-600">
        Error: {error}
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
            onUpdateStats={handleUpdateStats}  // ← MARK: passing updated handler
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
