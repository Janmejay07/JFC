import { Card } from "../Components/ui/card";

export function StatsCard({ title, subtitle, value, icon: Icon, gradient }) {
  return (
    <Card className={`p-6 ${gradient} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{subtitle}</h3>
          <p className="text-white/80">{value}</p>
        </div>
        <div className="h-16 w-16 opacity-80">
          <Icon strokeWidth={1.5} className="h-full w-full" />
        </div>
      </div>
    </Card>
  );
}
