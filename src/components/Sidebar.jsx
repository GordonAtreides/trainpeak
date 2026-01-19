import { Calendar, TrendingUp, Settings, Menu, X, Flame, Sun, Moon, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export const Sidebar = ({ currentView, onViewChange, onSettingsClick, user, onSignOut }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg lg:hidden"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        {collapsed ? (
          <Menu size={20} style={{ color: 'var(--text-primary)' }} />
        ) : (
          <X size={20} style={{ color: 'var(--text-primary)' }} />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-40
          transition-transform duration-200 ease-in-out flex flex-col
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
          lg:translate-x-0 lg:static
          w-56 lg:w-16 xl:w-56
        `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)'
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
            }}
          >
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span
            className="font-bold text-lg lg:hidden xl:block tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            TrainPeak
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onViewChange('calendar')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={currentView === 'calendar' ? {
                  background: 'linear-gradient(135deg, rgba(252,76,2,0.2), rgba(252,76,2,0.1))',
                  boxShadow: 'inset 0 0 0 1px rgba(252,76,2,0.3)',
                  color: 'var(--text-primary)',
                } : {
                  color: 'var(--text-secondary)',
                }}
              >
                <Calendar size={20} />
                <span className="font-medium lg:hidden xl:block">Calendar</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onViewChange('performance')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={currentView === 'performance' ? {
                  background: 'linear-gradient(135deg, rgba(252,76,2,0.2), rgba(252,76,2,0.1))',
                  boxShadow: 'inset 0 0 0 1px rgba(252,76,2,0.3)',
                  color: 'var(--text-primary)',
                } : {
                  color: 'var(--text-secondary)',
                }}
              >
                <TrendingUp size={20} />
                <span className="font-medium lg:hidden xl:block">Performance</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
          {/* User Info */}
          {user && (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(252, 76, 2, 0.2)' }}
              >
                <User size={16} style={{ color: '#fc4c02' }} />
              </div>
              <span
                className="text-sm truncate lg:hidden xl:block"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user.email}
              </span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium lg:hidden xl:block">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <button
            onClick={onSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Settings size={20} />
            <span className="font-medium lg:hidden xl:block">Settings</span>
          </button>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-red-500/10"
              style={{ color: 'var(--text-secondary)' }}
            >
              <LogOut size={20} />
              <span className="font-medium lg:hidden xl:block">Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};
