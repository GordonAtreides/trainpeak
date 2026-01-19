import { isToday } from '../utils/dateUtils';

const activityColors = {
  run: 'bg-emerald-400',
  bike: 'bg-amber-400',
  swim: 'bg-sky-400',
  strength: 'bg-purple-400',
  rest: 'bg-zinc-500',
};

export const MonthDayCell = ({ date, dayNumber, workouts = [], isCurrentMonth, onClick }) => {
  const today = isToday(date);

  // Get unique workout types for dots
  const workoutTypes = [...new Set(workouts.map(w => w.planned?.type).filter(Boolean))];

  // Calculate total TSS for the day
  const totalTSS = workouts.reduce((sum, w) => {
    return sum + (w.completed?.tss || w.planned?.tss || 0);
  }, 0);

  return (
    <button
      onClick={() => onClick(date)}
      className={`
        aspect-square p-1 rounded-lg transition-all text-left min-w-[44px] min-h-[44px]
        hover:bg-white/5
        ${!isCurrentMonth ? 'opacity-40' : ''}
      `}
      style={{
        backgroundColor: today ? 'rgba(252, 76, 2, 0.15)' : 'transparent',
        border: today ? '1px solid #fc4c02' : '1px solid transparent',
      }}
    >
      {/* Day number */}
      <div
        className="text-xs font-medium mb-0.5"
        style={{ color: today ? '#fc4c02' : '#a1a1aa' }}
      >
        {dayNumber}
      </div>

      {/* Workout indicators */}
      {workouts.length > 0 && (
        <div className="space-y-0.5">
          {/* Activity type dots */}
          <div className="flex gap-0.5 flex-wrap">
            {workoutTypes.slice(0, 4).map((type, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${activityColors[type] || 'bg-zinc-500'}`}
              />
            ))}
            {workoutTypes.length > 4 && (
              <span className="text-xs text-zinc-500">+</span>
            )}
          </div>

          {/* TSS indicator */}
          {totalTSS > 0 && (
            <div className="text-xs text-zinc-500 leading-none">
              {totalTSS}
            </div>
          )}
        </div>
      )}
    </button>
  );
};
