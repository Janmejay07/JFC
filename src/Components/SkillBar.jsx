import React from "react";

// Function to determine the class based on percentage
const getSkillBarClass = (percentage) => {
  if (percentage >= 80) return "skill-bar-green"; // Green
  if (percentage >= 60) return "skill-bar-orange"; // Orange
  if (percentage >= 40) return "skill-bar-blue"; // Blue
  return "skill-bar-red"; // Red
};

const SkillBar = ({ name, percentage, delay = 0 }) => {
  const skillBarClass = getSkillBarClass(percentage);

  return (
    <div className="mb-8 last:mb-0 group">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
          {name}
        </span>
        <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out transform origin-left scale-x-0 animate-skill-bar ${skillBarClass}`}
          style={{
            width: `${percentage}%`,
            animationDelay: `${delay}ms`,
            animationFillMode: "forwards",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
