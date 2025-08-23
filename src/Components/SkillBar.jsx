import React, { useEffect, useState } from "react";

// ✅ SkillBar Component
function SkillBar({ name, percentage, delay = 0 }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Assign color based on percentage
  const getSkillColor = (p) => {
    if (p >= 80) return "from-green-400 to-green-600";
    if (p >= 60) return "from-blue-400 to-blue-600";
    if (p >= 40) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

const getGlowClass = (p) => {
  if (p >= 80) return "hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)]";  
  if (p >= 60) return "hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]";  
  if (p >= 40) return "hover:drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]";   
  return "hover:drop-shadow-[0_0_20px_rgba(248,113,113,0.9)]";              
};


  // Assign skill level name
  const getSkillLevel = (p) => {
    if (p >= 80) return "Expert";
    if (p >= 60) return "Advanced";
    if (p >= 40) return "Intermediate";
    return "Beginner";
  };

  // Animate bar growth
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercentage(percentage), delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="mb-6 last:mb-0">
      {/* Label + Percentage */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            {getSkillLevel(percentage)}
          </span>
          <span className="text-sm font-bold text-blue-600">{percentage}%</span>
        </div>
      </div>

      {/* Wrapper WITHOUT overflow-hidden so glow isn't clipped */}
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${getSkillColor(
            percentage
          )} transition-all duration-1000 ease-out relative overflow-hidden
          ${getGlowClass(percentage)} 
          hover:brightness-110
          `}
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* shimmer */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export default SkillBar;
