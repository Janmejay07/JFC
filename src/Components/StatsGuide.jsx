import { HelpCircle } from 'lucide-react';
import { Card } from "../Components/ui/card";

const STATS_GUIDE = [
  { label: "P", desc: "Played" },
  { label: "W", desc: "Won", color: "text-green-600" },
  { label: "D", desc: "Drawn", color: "text-yellow-600" },
  { label: "L", desc: "Lost", color: "text-red-600" },
  { label: "G", desc: "Goals Scored", color: "text-blue-600" },
  { label: "A", desc: "Assists" },
  { label: "S", desc: "Saves" },
  { label: "PTS", desc: "Points" },
];

export function StatsGuide() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5" />
        Statistics Guide
      </h2>
      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {STATS_GUIDE.map(({ label, desc, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`font-semibold ${color || "text-gray-700"}`}>
                {label}:
              </span>
              <span className="text-gray-600 text-sm">{desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}