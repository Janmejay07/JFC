import { Trophy, Calendar } from 'lucide-react';

export function StatsHeader({ currentSeason, seasonDates }) {
  return (
    <div className="text-center space-y-2 mb-12">
      <div className="flex items-center justify-center gap-3">
        <Trophy className="h-12 w-12 text-yellow-500" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Player Rankings
        </h1>
      </div>
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <Calendar className="h-4 w-4" />
        <p>
          Season {currentSeason}: {seasonDates.start} - {seasonDates.end}
        </p>
      </div>
    </div>
  );
}