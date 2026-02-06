export default function QualityScore({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (s >= 75) return 'text-blue-600 dark:text-blue-400';
    if (s >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBarColor = (s: number) => {
    if (s >= 90) return 'bg-emerald-500';
    if (s >= 75) return 'bg-blue-500';
    if (s >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${getColor(score)}`}>{score}</span>
    </div>
  );
}
