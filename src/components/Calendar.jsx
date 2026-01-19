import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { DayCell } from './DayCell';
import { getWeekDates, addWeeks, getWeekRange, formatDate } from '../utils/dateUtils';

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Calendar = ({ workouts, onDayClick, onMoveWorkout }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    // Get 2 weeks of dates
    setWeekDates(getWeekDates(currentDate, 2));
  }, [currentDate]);

  const navigateWeek = useCallback((direction) => {
    // Navigate by 2 weeks at a time
    setCurrentDate(prev => addWeeks(prev, direction * 2));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        navigateWeek(-1);
      } else if (e.key === 'ArrowRight') {
        navigateWeek(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateWeek]);

  // Get ALL workouts for a date (supports multiple per day)
  const getWorkoutsForDate = (date) => {
    return workouts.filter(w => w.date === date);
  };

  // Drag handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const workout = workouts.find(w => w.id === active.id);
    setActiveWorkout(workout);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveWorkout(null);

    if (over && active.id !== over.id) {
      const workoutId = active.id;
      const newDate = over.id; // over.id is the date string

      // Only move if dropping on a different date
      const workout = workouts.find(w => w.id === workoutId);
      if (workout && workout.date !== newDate && onMoveWorkout) {
        onMoveWorkout(workoutId, newDate);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveWorkout(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {getWeekRange(weekDates)}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
            style={{
              color: '#fc4c02',
              backgroundColor: 'rgba(252, 76, 2, 0.1)',
            }}
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all hover:bg-white/5"
            title="Previous weeks (←)"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all hover:bg-white/5"
            title="Next weeks (→)"
          >
            <ChevronRight size={20} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
        <div className="min-w-[700px] lg:min-w-0">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAY_HEADERS.map(day => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 2-Week Grid with Drag & Drop */}
          <DndContext
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map(date => (
                <DayCell
                  key={date}
                  date={date}
                  workouts={getWorkoutsForDate(date)}
                  onClick={onDayClick}
                />
              ))}
            </div>

            {/* Drag overlay - shows the dragged item */}
            <DragOverlay>
              {activeWorkout ? (
                <div className="p-2 rounded-lg bg-white shadow-lg border-2 border-orange-400 opacity-90">
                  <p className="text-xs font-medium text-gray-800">
                    {activeWorkout.planned?.name || 'Workout'}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

// Export weekDates for parent components to use
export { getWeekDates };
