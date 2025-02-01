import { Crown, Target } from 'lucide-react';
import { StatsCard } from './StatsCard';

export function WeeklyLeaders({ weeklyMVP, weeklyTopScorer }) {
  if (!weeklyMVP && !weeklyTopScorer) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Leaders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weeklyMVP && (
          <StatsCard
            title="Weekly MVP"
            subtitle={weeklyMVP.player}
            value={`${weeklyMVP.pt} Points`}
            icon={Crown}
            gradient="bg-gradient-to-br from-green-500 to-teal-600"
          />
        )}
        {weeklyTopScorer && (
          <StatsCard
            title="Weekly Top Scorer"
            subtitle={weeklyTopScorer.player}
            value={`${weeklyTopScorer.g} Goals`}
            icon={Target}
            gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
          />
        )}
      </div>
    </div>
  );
}