import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthDayCell } from './MonthDayCell';
import { getMonthDates, addMonths, getMonthYear, formatDate } from '../utils/dateUtils';

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthCalendar = ({ workouts, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [monthDates, setMonthDates] = useState([]);

  useEffect(() => {
    setMonthDates(getMonthDates(currentDate));
  }, [currentDate]);

  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => addMonths(prev, direction));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        navigateMonth(-1);
      } else if (e.key === 'ArrowRight') {
        navigateMonth(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateMonth]);

  const getWorkoutsForDate = (date) => {
    return workouts.filter(w => w.date === date);
  };

  const handleDayClick = (date) => {
    const dayWorkouts = getWorkoutsForDate(date);
    onDayClick(date, dayWorkouts[0] || null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">
            {getMonthYear(currentDate)}
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
            onClick={() => navigateMonth(-1)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all hover:bg-white/5"
            title="Previous month (←)"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all hover:bg-white/5"
            title="Next month (→)"
          >
            <ChevronRight size={20} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_HEADERS.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div
        className="grid grid-cols-7 gap-1 rounded-xl p-2"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {monthDates.map(({ date, dayNumber, isCurrentMonth }) => (
          <MonthDayCell
            key={date}
            date={date}
            dayNumber={dayNumber}
            workouts={getWorkoutsForDate(date)}
            isCurrentMonth={isCurrentMonth}
            onClick={handleDayClick}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Run</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Ride</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Swim</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Strength</span>
        </div>
      </div>
    </div>
  );
};
