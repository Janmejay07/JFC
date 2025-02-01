import { Crown, Target } from 'lucide-react';
import { StatsCard } from './StatsCard';

export function SeasonLeaders({ currentSeason, topPlayer, topScorer }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {topPlayer && (
        <StatsCard
          title={`Season ${currentSeason} MVP`}
          subtitle={topPlayer.player}
          value={`${topPlayer.pt} Points`}
          icon={Crown}
          gradient="bg-gradient-to-br from-yellow-500 to-amber-600"
        />
      )}
      {topScorer && (
        <StatsCard
          title={`Season ${currentSeason} Top Scorer`}
          subtitle={topScorer.player}
          value={`${topScorer.g} Goals`}
          icon={Target}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
      )}
    </div>
  );
}