import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { SeasonLeaders } from "../Components/SeasonLeaders";
import { WeeklyLeaders } from "../Components/WeeklyLeaders";
import { PlayerStatsTable } from "../Components/PlayerStatsTable";
import { StatsGuide } from "../Components/StatsGuide";
import { FullPageLoading } from "../Components/ui/Loading";
import { API_ENDPOINTS } from "../lib/config";

function Stats() {
  const [players, setPlayers] = useState([]);
  const [pastSeasons, setPastSeasons] = useState(() => JSON.parse(localStorage.getItem('pastSeasons') || '[]'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [weeklyMVP, setWeeklyMVP] = useState(null);
  const [weeklyTopScorer, setWeeklyTopScorer] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(new Date().getMonth() + 1); // 1..12
  const [seasonStartDate, setSeasonStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekOfMonth, setWeekOfMonth] = useState(() => parseInt(localStorage.getItem('currentWeekOfMonth')) || getCurrentWeekOfMonth(new Date()));

  function getCurrentWeekOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const day = date.getDate();
    return Math.min(4, Math.ceil((firstDay + day) / 7));
  }

  const seasonKey = useMemo(() => {
    const y = seasonStartDate.getFullYear();
    const m = String(seasonStartDate.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, [seasonStartDate]);

  const apiSeason = useMemo(() => new Date(seasonStartDate).getMonth() + 1, [seasonStartDate]); // 1..12 per backend

  const weekKey = useMemo(() => `W${weekOfMonth}`, [weekOfMonth]);
  const seasonWeekKey = useMemo(() => `${apiSeason}-${weekOfMonth}`, [apiSeason, weekOfMonth]);

  const isViewingCurrent = useMemo(() => {
    const now = new Date();
    const nowSeason = now.getMonth() + 1;
    const nowWeek = getCurrentWeekOfMonth(now);
    return apiSeason === nowSeason && weekOfMonth === nowWeek;
  }, [apiSeason, weekOfMonth]);

  const seasonOptions = useMemo(() => {
    const options = [];
    const all = [
      { key: seasonKey, date: seasonStartDate },
      ...pastSeasons.map(s => ({ key: s.seasonKey, date: new Date(s.startDate) }))
    ];
    const seen = new Set();
    all.forEach(({ key, date }) => {
      if (seen.has(key)) return; seen.add(key);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const label = `Season ${start.getMonth() + 1}: ${format(start, "MMMM dd, yyyy")} - ${format(end, "MMMM dd, yyyy")}`;
      options.push({ key, label, start, end });
    });
    return options;
  }, [seasonKey, seasonStartDate, pastSeasons]);

  // handle month rollover (season) and week rollover
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      if (start.getTime() !== seasonStartDate.getTime()) {
        const prevStart = seasonStartDate;
        const prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 1, 0);
        const archived = {
          seasonKey: `${prevStart.getFullYear()}-${String(prevStart.getMonth() + 1).padStart(2, '0')}`,
          startDate: prevStart.toISOString(),
          endDate: prevEnd.toISOString(),
        };
        setPastSeasons((prev) => {
          const next = [archived, ...prev.filter(p => p.seasonKey !== archived.seasonKey)].slice(0, 24);
          localStorage.setItem('pastSeasons', JSON.stringify(next));
          return next;
        });
        setSeasonStartDate(start);
        setCurrentSeason(now.getMonth() + 1);
        setWeekOfMonth(getCurrentWeekOfMonth(now));
        localStorage.setItem('currentWeekOfMonth', String(getCurrentWeekOfMonth(now)));
        window.dispatchEvent(new Event('standings-updated'));
      } else {
        const wk = getCurrentWeekOfMonth(now);
        if (wk !== weekOfMonth) {
          setWeekOfMonth(wk);
          localStorage.setItem('currentWeekOfMonth', String(wk));
        }
      }
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, [seasonStartDate, weekOfMonth]);

  const calculateAchievements = (currentPlayers) => {
    if (!currentPlayers.length) return [];
    const maxGoals = Math.max(...currentPlayers.map((p) => (p.g || 0)));
    const maxGames = Math.max(...currentPlayers.map((p) => (p.p || 0)));
    const maxSaves = Math.max(...currentPlayers.map((p) => (p.s || 0)));
    return currentPlayers.map((player) => {
      const ach = [];
      if (player.g === maxGoals && maxGoals > 0) ach.push("Top Scorer");
      if (player.p === maxGames && maxGames > 0) ach.push("Most Consistent");
      if (player.s === maxSaves && maxSaves > 0 && player.w / player.p > 0.6)
        ach.push("Best Defender");
      return { ...player, achievements: ach };
    });
  };

  // Backend weekly winners
  const upsertWeeklyWinners = useCallback(async (playersList) => {
    try {
      const topScorer = playersList.reduce((a, b) => (b.g > a.g ? b : a));
      const mvp = playersList.reduce((a, b) => (b.pt > a.pt ? b : a));
      const winners = {
        mvp: mvp && { player: mvp.player, pt: mvp.pt },
        topScorer: topScorer && { player: topScorer.player, g: topScorer.g },
      };
      await fetch(API_ENDPOINTS.WEEKLY_WINNERS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season: apiSeason, week: weekOfMonth, winners })
      });
    } catch (e) {
      // swallow non-critical network errors here
      console.error('Failed to upsert weekly winners', e);
    }
  }, [apiSeason, weekOfMonth]);

  const fetchWeeklyWinners = useCallback(async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.WEEKLY_WINNERS}?season=${apiSeason}&week=${weekOfMonth}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data || null;
    } catch {
      return null;
    }
  }, [apiSeason, weekOfMonth]);

  const handleUpdateStats = async (updated) => {
    try {
      if (Array.isArray(updated)) {
        const normalized = updated.map((p) => ({ ...p, s: p.s || 0, season: p.season || seasonKey }));
        setPlayers(calculateAchievements(normalized));
        upsertWeeklyWinners(normalized);
      } else if (updated && (updated._id || updated.id)) {
        const updatedId = updated._id || updated.id;
        const merged = players.map((p) => (p._id === updatedId || p.id === updatedId ? { ...p, ...updated, season: updated.season || p.season || seasonKey } : p));
        const normalized = merged.map((p) => ({ ...p, s: p.s || 0, season: p.season || seasonKey }));
        setPlayers(calculateAchievements(normalized));
        upsertWeeklyWinners(normalized);
      }
      setError(null);
      window.dispatchEvent(new Event('standings-updated'));
    } catch (err) {
      setError("Failed to apply local update.");
    }
  };

  const fetchPlayers = useCallback(async () => {
    try {
      const url = `${API_ENDPOINTS.STANDINGS}?season=${apiSeason}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch player data");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API response format");
      const filtered = data; // backend already filters/sorts by season
      const prepared = filtered.map((p) => ({ ...p, s: p.s || 0, season: p.season || seasonKey }));
      setPlayers(calculateAchievements(prepared));
      const saved = await fetchWeeklyWinners();
      if (saved && saved.winners) {
        setWeeklyTopScorer(saved.winners.topScorer || null);
        setWeeklyMVP(saved.winners.mvp || null);
      } else {
        // compute and upsert if nothing saved yet
        await upsertWeeklyWinners(prepared);
        const after = await fetchWeeklyWinners();
        if (after && after.winners) {
          setWeeklyTopScorer(after.winners.topScorer || null);
          setWeeklyMVP(after.winners.mvp || null);
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiSeason, seasonKey, fetchWeeklyWinners, upsertWeeklyWinners]);

  useEffect(() => { fetchPlayers(); }, [fetchPlayers]);

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
    const onStandingsUpdated = () => { fetchPlayers(); };
    window.addEventListener('standings-updated', onStandingsUpdated);
    return () => window.removeEventListener('standings-updated', onStandingsUpdated);
  }, [fetchPlayers]);

  useEffect(() => {
    // when week dropdown changes, fetch winners from backend
    fetchPlayers();
  }, [apiSeason, weekOfMonth]);

  // Live polling removed; updates occur on season/week change or stat updates

  const getPlayerRating = (pt) => { if (pt == null) return 0; return Number(((pt / 50) * 10).toFixed(1)); };
  const getTopPerformer = () => players.length ? players.reduce((a, b) => (b.pt > a.pt ? b : a)) : null;
  const getTopScorer = () => players.length ? players.reduce((a, b) => (b.g > a.g ? b : a)) : null;

  const formatSeasonDates = (d) => {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { start: format(start, "MMMM dd, yyyy"), end: format(end, "MMMM dd, yyyy") };
  };

  if (loading) {
    return (<FullPageLoading variant="light" message="Loading player standings..." showProgress={true} />);
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

  const topPlayer = players.length ? players.reduce((a, b) => (b.pt > a.pt ? b : a)) : null;
  const topScorer = players.length ? players.reduce((a, b) => (b.g > a.g ? b : a)) : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Player Rankings</h1>
            <div className="flex justify-center">
              <label className="sr-only">Season</label>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={seasonKey}
                onChange={(e) => {
                  const key = e.target.value;
                  const [y, m] = key.split('-').map(Number);
                  const newDate = new Date(y, m - 1, 1);
                  setSeasonStartDate(newDate);
                  setCurrentSeason(m);
                  // If selecting current season, snap week to current week automatically
                  const now = new Date();
                  const nowSeason = now.getMonth() + 1;
                  if (m === nowSeason) {
                    const wk = getCurrentWeekOfMonth(now);
                    setWeekOfMonth(wk);
                    localStorage.setItem('currentWeekOfMonth', String(wk));
                  }
                }}
              >
                {seasonOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <SeasonLeaders currentSeason={currentSeason} topPlayer={topPlayer} topScorer={topScorer} />

          <div className="flex items-center justify-between mt-6">
            <h2 className="text-xl font-semibold">Weekly Leaders</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Week</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={weekOfMonth}
                onChange={(e) => setWeekOfMonth(parseInt(e.target.value) || 1)}
              >
                <option value={1}>Week 1</option>
                <option value={2}>Week 2</option>
                <option value={3}>Week 3</option>
                <option value={4}>Week 4</option>
              </select>
            </div>
          </div>

          <WeeklyLeaders weeklyMVP={weeklyMVP} weeklyTopScorer={weeklyTopScorer} weeklyDates={{ start: '', end: '' }} />

          <PlayerStatsTable players={players} onUpdateStats={handleUpdateStats} getPlayerRating={getPlayerRating} isAdmin={isAdmin} seasonKey={seasonKey} />
          <StatsGuide />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Stats;
