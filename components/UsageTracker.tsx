import React from 'react';

interface UsageTrackerProps {
  usageCount: number;
  maxTrials: number;
}

export const UsageTracker: React.FC<UsageTrackerProps> = ({ usageCount, maxTrials }) => {
  const percentage = maxTrials > 0 ? (usageCount / maxTrials) * 100 : 0;

  return (
    <div className="text-right w-48">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-300">Free Trial Usage</span>
        <span className="text-xs font-semibold text-gray-400">
          {usageCount} / {maxTrials}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label="Usage percentage"
        ></div>
      </div>
    </div>
  );
};