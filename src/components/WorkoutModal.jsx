import { useState, useEffect } from 'react';
import { X, Trash2, Check, Bookmark, ChevronLeft } from 'lucide-react';
import { getDayName, getDayNumber, getMonthName } from '../utils/dateUtils';
import { estimateTSS } from '../utils/tssCalculations';
import { TemplatePicker } from './TemplatePicker';

const activityTypes = [
  { value: 'run', label: 'Run', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  { value: 'bike', label: 'Bike', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
  { value: 'swim', label: 'Swim', color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.15)' },
  { value: 'strength', label: 'Strength', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' },
  { value: 'rest', label: 'Rest', color: '#71717a', bgColor: 'rgba(113, 113, 122, 0.15)' },
];

export const WorkoutModal = ({ isOpen, onClose, date, workout, onSave, onDelete, templates = [], onSaveTemplate }) => {
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [formData, setFormData] = useState({
    type: 'run',
    name: '',
    description: '',
    duration: '',
    tss: '',
    isCompleted: false,
    actualDuration: '',
    actualTss: '',
    avgHr: '',
    notes: '',
  });

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && date) {
      if (workout) {
        setShowTemplatePicker(false);
        setFormData({
          type: workout.planned?.type || 'run',
          name: workout.planned?.name || '',
          description: workout.planned?.description || '',
          duration: workout.planned?.duration?.toString() || '',
          tss: workout.planned?.tss?.toString() || '',
          isCompleted: !!workout.completed,
          actualDuration: workout.completed?.duration?.toString() || '',
          actualTss: workout.completed?.tss?.toString() || '',
          avgHr: workout.completed?.avgHr?.toString() || '',
          notes: workout.completed?.notes || '',
        });
      } else {
        // Show template picker for new workouts if templates exist
        setShowTemplatePicker(templates.length > 0);
        setFormData({
          type: 'run',
          name: '',
          description: '',
          duration: '',
          tss: '',
          isCompleted: false,
          actualDuration: '',
          actualTss: '',
          avgHr: '',
          notes: '',
        });
      }
    }
  }, [isOpen, date, workout, templates.length]);

  const handleSelectTemplate = (template) => {
    setFormData({
      type: template.type,
      name: template.name,
      description: template.description || '',
      duration: template.duration?.toString() || '',
      tss: template.tss?.toString() || '',
      isCompleted: false,
      actualDuration: '',
      actualTss: '',
      avgHr: '',
      notes: '',
    });
    setShowTemplatePicker(false);
  };

  const handleSaveAsTemplate = () => {
    if (onSaveTemplate && formData.name) {
      onSaveTemplate({
        name: formData.name,
        type: formData.type,
        duration: parseInt(formData.duration) || 0,
        tss: parseInt(formData.tss) || 0,
        description: formData.description,
      });
    }
  };

  // Auto-estimate TSS when duration changes
  useEffect(() => {
    if (formData.duration && !formData.tss) {
      const effort = formData.type === 'strength' ? 'strength' : 'moderate';
      const estimated = estimateTSS(parseInt(formData.duration), effort);
      setFormData(prev => ({ ...prev, tss: estimated.toString() }));
    }
  }, [formData.duration, formData.type]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const workoutData = {
      id: workout?.id,
      date,
      planned: {
        type: formData.type,
        name: formData.name || `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Workout`,
        description: formData.description,
        duration: parseInt(formData.duration) || 0,
        tss: parseInt(formData.tss) || 0,
      },
      completed: formData.isCompleted ? {
        duration: parseInt(formData.actualDuration) || parseInt(formData.duration) || 0,
        tss: parseInt(formData.actualTss) || parseInt(formData.tss) || 0,
        avgHr: parseInt(formData.avgHr) || null,
        notes: formData.notes,
      } : null,
    };

    onSave(workoutData);
    onClose();
  };

  const handleDelete = () => {
    if (workout?.id && window.confirm('Delete this workout?')) {
      onDelete(workout.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  const dateStr = date ? `${getDayName(date)}, ${getMonthName(date)} ${getDayNumber(date)}` : '';
  const selectedType = activityTypes.find(t => t.value === formData.type);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className="rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 sm:p-6"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              {showTemplatePicker && (
                <button
                  onClick={() => setShowTemplatePicker(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                  <ChevronLeft size={20} className="text-zinc-400" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {showTemplatePicker ? 'Choose Template' : (workout ? 'Edit Workout' : 'Add Workout')}
                </h2>
                <p className="text-sm text-zinc-500">{dateStr}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
            >
              <X size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* Template Picker or Form */}
          {showTemplatePicker ? (
            <div className="p-4 sm:p-6">
              <TemplatePicker
                templates={templates}
                onSelect={handleSelectTemplate}
                onClose={() => setShowTemplatePicker(false)}
              />
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Activity Type */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Activity Type
              </label>
              <div className="flex flex-wrap gap-2">
                {activityTypes.map(({ value, label, color, bgColor }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange('type', value)}
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
                    style={{
                      backgroundColor: formData.type === value ? bgColor : 'var(--bg-elevated)',
                      color: formData.type === value ? color : '#a1a1aa',
                      border: formData.type === value ? `1px solid ${color}40` : '1px solid transparent',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Workout Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g., Easy Run, Tempo Ride"
                autoComplete="off"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Workout details, intervals, notes..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600 resize-none"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                }}
              />
            </div>

            {/* Planned Duration & TSS */}
            {formData.type !== 'rest' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={e => handleChange('duration', e.target.value)}
                    placeholder="60"
                    min="0"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Planned TSS
                  </label>
                  <input
                    type="number"
                    value={formData.tss}
                    onChange={e => handleChange('tss', e.target.value)}
                    placeholder="Auto"
                    min="0"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Completion Toggle */}
            <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => handleChange('isCompleted', !formData.isCompleted)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: formData.isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-elevated)',
                  border: formData.isCompleted ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: formData.isCompleted ? '#22c55e' : 'transparent',
                    borderColor: formData.isCompleted ? '#22c55e' : '#3f3f46',
                  }}
                >
                  {formData.isCompleted && <Check size={14} className="text-white" />}
                </div>
                <span className={`font-medium ${formData.isCompleted ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {formData.isCompleted ? 'Completed' : 'Mark as completed'}
                </span>
              </button>
            </div>

            {/* Actual Values (if completed) */}
            {formData.isCompleted && formData.type !== 'rest' && (
              <div className="space-y-3 sm:space-y-4 pl-3 sm:pl-4" style={{ borderLeft: '2px solid rgba(34, 197, 94, 0.3)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Actual Duration
                    </label>
                    <input
                      type="number"
                      value={formData.actualDuration}
                      onChange={e => handleChange('actualDuration', e.target.value)}
                      placeholder={formData.duration || '60'}
                      min="0"
                      autoComplete="off"
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Actual TSS
                    </label>
                    <input
                      type="number"
                      value={formData.actualTss}
                      onChange={e => handleChange('actualTss', e.target.value)}
                      placeholder={formData.tss || 'Auto'}
                      min="0"
                      autoComplete="off"
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Avg Heart Rate
                  </label>
                  <input
                    type="number"
                    value={formData.avgHr}
                    onChange={e => handleChange('avgHr', e.target.value)}
                    placeholder="Optional"
                    min="0"
                    max="250"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                    placeholder="How did it feel?"
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all text-white placeholder-zinc-600 resize-none"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {workout ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                ) : null}
                {onSaveTemplate && formData.name && (
                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    className="flex items-center gap-2 px-3 py-2 text-zinc-500 hover:text-orange-400 rounded-lg transition-colors text-sm"
                    style={{ backgroundColor: 'transparent' }}
                    title="Save as template"
                  >
                    <Bookmark size={16} />
                    Save Template
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 font-medium rounded-lg transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
                    color: 'white',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
          )}
        </div>
      </div>
    </>
  );
};
