import { Check, Plus, GripVertical } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { getDayNumber, isToday } from '../utils/dateUtils';

const activityConfig = {
  run: { label: 'RUN', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  bike: { label: 'RIDE', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
  swim: { label: 'SWIM', color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.15)' },
  strength: { label: 'STRENGTH', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' },
  rest: { label: 'REST', color: '#71717a', bgColor: 'rgba(113, 113, 122, 0.15)' },
};

const formatDuration = (minutes) => {
  if (!minutes) return null;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  }
  return `${mins}min`;
};

const DraggableWorkoutItem = ({ workout, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: workout.id,
  });

  const planned = workout?.planned;
  const completed = workout?.completed;
  const activity = planned?.type ? activityConfig[planned.type] : null;

  const duration = completed?.duration || planned?.duration;
  const tss = completed?.tss || planned?.tss;
  const distance = completed?.distance;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: completed ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
        border: completed ? '1px solid rgba(34, 197, 94, 0.3)' : '1px dashed var(--border-light)',
      }}
      className={`
        p-2.5 rounded-lg transition-all cursor-pointer
        hover:border-zinc-500
        ${isDragging ? 'opacity-50 shadow-xl ring-2 ring-orange-500' : ''}
      `}
    >
      <div className="flex items-start gap-1.5">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className="p-0.5 mt-0.5 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={12} />
        </button>

        <div
          className="flex-1 min-w-0"
          onClick={(e) => {
            e.stopPropagation();
            onClick(workout);
          }}
        >
          {/* Activity badge + completion status */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {activity && (
              <span
                className="px-1.5 py-0.5 rounded text-xs font-bold"
                style={{
                  backgroundColor: activity.bgColor,
                  color: activity.color,
                }}
              >
                {activity.label}
              </span>
            )}
            {completed && (
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
                <Check size={10} style={{ color: '#22c55e' }} />
              </div>
            )}
          </div>

          {/* Workout name */}
          <p className="text-sm font-medium truncate mb-1" style={{ color: 'var(--text-primary)' }}>
            {planned?.name || 'Workout'}
          </p>

          {/* Stats */}
          {planned?.type !== 'rest' && (
            <div className="space-y-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              {duration && <p>{formatDuration(duration)}</p>}
              {distance && <p>{distance.toFixed(2)} mi</p>}
              {tss > 0 && (
                <p className="font-semibold" style={{ color: '#fc4c02' }}>{tss} TSS</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DayCell = ({ date, workouts = [], onClick }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: date,
  });

  const dayNumber = getDayNumber(date);
  const today = isToday(date);

  const handleDayClick = () => {
    onClick(date, workouts[0] || null);
  };

  const handleWorkoutClick = (workout) => {
    onClick(date, workout);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    onClick(date, null);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleDayClick}
      className={`
        min-h-[140px] lg:min-h-[180px] rounded-xl p-2.5 lg:p-3 flex flex-col cursor-pointer transition-all duration-150
        ${isOver ? 'ring-2 ring-orange-500' : ''}
      `}
      style={{
        backgroundColor: isOver ? 'rgba(252, 76, 2, 0.1)' : 'var(--bg-card)',
        border: today ? '1px solid #fc4c02' : '1px solid var(--border)',
        boxShadow: today ? '0 0 20px rgba(252, 76, 2, 0.15)' : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`
            w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
          `}
          style={{
            backgroundColor: today ? '#fc4c02' : 'transparent',
            color: today ? 'white' : '#a1a1aa',
          }}
        >
          {dayNumber}
        </span>
        {today && (
          <span className="text-xs font-medium" style={{ color: '#fc4c02' }}>Today</span>
        )}
      </div>

      {/* Workouts */}
      <div className="flex-1 flex flex-col">
        {workouts.length > 0 ? (
          <div className="space-y-2 flex-1">
            {workouts.map((workout) => (
              <DraggableWorkoutItem
                key={workout.id}
                workout={workout}
                onClick={handleWorkoutClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors">
            <div className="flex items-center gap-1 text-xs">
              <Plus size={14} />
              Add workout
            </div>
          </div>
        )}

        {/* Add more button */}
        {workouts.length > 0 && (
          <button
            onClick={handleAddClick}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-500 hover:text-orange-500 rounded-lg border border-dashed border-zinc-700 hover:border-orange-500/50 transition-all"
          >
            <Plus size={12} />
            Add
          </button>
        )}
      </div>
    </div>
  );
};
