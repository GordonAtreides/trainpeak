import { useState } from 'react';
import { Clock, Zap } from 'lucide-react';

const typeConfig = {
  run: { label: 'Run', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  bike: { label: 'Ride', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' },
  swim: { label: 'Swim', color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.15)', borderColor: 'rgba(14, 165, 233, 0.3)' },
  strength: { label: 'Strength', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)' },
  rest: { label: 'Rest', color: '#71717a', bgColor: 'rgba(113, 113, 122, 0.15)', borderColor: 'rgba(113, 113, 122, 0.3)' },
};

const TemplateCard = ({ template, onSelect, config }) => (
  <button
    onClick={() => onSelect(template)}
    className="w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02]"
    style={{
      backgroundColor: config.bgColor,
      border: `1px solid ${config.borderColor}`,
    }}
  >
    <p className="font-medium text-sm" style={{ color: config.color }}>{template.name}</p>
    {template.type !== 'rest' && (
      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {template.duration}min
        </span>
        <span className="flex items-center gap-1">
          <Zap size={12} />
          {template.tss} TSS
        </span>
      </div>
    )}
    {template.description && (
      <p className="text-xs text-zinc-600 mt-1 line-clamp-1">{template.description}</p>
    )}
  </button>
);

export const TemplatePicker = ({ templates, onSelect, onClose }) => {
  const [activeType, setActiveType] = useState('run');

  const types = ['run', 'bike', 'swim', 'strength', 'rest'];
  const filteredTemplates = templates.filter(t => t.type === activeType);

  return (
    <div className="space-y-4">
      {/* Type tabs */}
      <div className="flex gap-1 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
        {types.map(type => {
          const config = typeConfig[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: isActive ? config.bgColor : 'transparent',
                color: isActive ? config.color : '#71717a',
                border: isActive ? `1px solid ${config.borderColor}` : '1px solid transparent',
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onSelect}
            config={typeConfig[template.type]}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <p className="text-sm text-zinc-600 text-center py-4">
          No templates for this type yet
        </p>
      )}

      {/* Skip templates button */}
      <button
        onClick={onClose}
        className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        Skip - create from scratch
      </button>
    </div>
  );
};
