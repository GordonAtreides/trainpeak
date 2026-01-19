import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const Tooltip = ({ content, children, iconSize = 14 }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="ml-1 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        aria-label="More information"
      >
        <HelpCircle size={iconSize} />
      </button>

      {isVisible && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs rounded-lg shadow-xl"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div className="relative">
            {content}
            {/* Arrow */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid var(--bg-card)',
              }}
            />
          </div>
        </div>
      )}
    </span>
  );
};

// Inline tooltip that wraps any element
export const TooltipWrapper = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs rounded-lg shadow-xl whitespace-normal"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--bg-card)',
            }}
          />
        </div>
      )}
    </div>
  );
};
