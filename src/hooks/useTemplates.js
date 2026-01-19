import { useState, useEffect, useCallback } from 'react';

const getStorageKey = (userId) => `trainpeak_templates_${userId}`;

const DEFAULT_TEMPLATES = [
  {
    id: 'default-easy-run',
    name: 'Easy Run',
    type: 'run',
    duration: 45,
    tss: 35,
    description: 'Zone 2 easy effort, conversational pace',
    isDefault: true,
  },
  {
    id: 'default-long-run',
    name: 'Long Run',
    type: 'run',
    duration: 90,
    tss: 100,
    description: 'Weekly long run at easy-moderate effort',
    isDefault: true,
  },
  {
    id: 'default-tempo',
    name: 'Tempo Run',
    type: 'run',
    duration: 50,
    tss: 65,
    description: 'Warmup + 20-30min at threshold + cooldown',
    isDefault: true,
  },
  {
    id: 'default-intervals',
    name: 'Intervals',
    type: 'run',
    duration: 60,
    tss: 80,
    description: 'Track workout with hard efforts and recovery',
    isDefault: true,
  },
  {
    id: 'default-recovery',
    name: 'Recovery Run',
    type: 'run',
    duration: 30,
    tss: 20,
    description: 'Very easy shake-out run',
    isDefault: true,
  },
  {
    id: 'default-easy-ride',
    name: 'Easy Ride',
    type: 'bike',
    duration: 60,
    tss: 45,
    description: 'Zone 2 endurance ride',
    isDefault: true,
  },
  {
    id: 'default-long-ride',
    name: 'Long Ride',
    type: 'bike',
    duration: 180,
    tss: 150,
    description: 'Weekly long ride at steady effort',
    isDefault: true,
  },
  {
    id: 'default-swim',
    name: 'Swim Session',
    type: 'swim',
    duration: 45,
    tss: 40,
    description: 'Pool workout with drills and sets',
    isDefault: true,
  },
  {
    id: 'default-strength',
    name: 'Strength Training',
    type: 'strength',
    duration: 45,
    tss: 30,
    description: 'Gym session - core and legs focus',
    isDefault: true,
  },
  {
    id: 'default-rest',
    name: 'Rest Day',
    type: 'rest',
    duration: 0,
    tss: 0,
    description: 'Full rest or light stretching only',
    isDefault: true,
  },
];

export const useTemplates = (userId) => {
  const [templates, setTemplates] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load templates from localStorage when userId changes
  useEffect(() => {
    if (!userId) {
      setTemplates(DEFAULT_TEMPLATES);
      setIsLoaded(false);
      return;
    }

    const storageKey = getStorageKey(userId);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults (in case new defaults were added)
        const defaultIds = DEFAULT_TEMPLATES.map(t => t.id);
        const userTemplates = parsed.filter(t => !defaultIds.includes(t.id));
        setTemplates([...DEFAULT_TEMPLATES, ...userTemplates]);
      } catch (e) {
        console.error('Failed to parse templates:', e);
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }
    setIsLoaded(true);
  }, [userId]);

  // Save to localStorage whenever templates change
  useEffect(() => {
    if (isLoaded && userId) {
      const storageKey = getStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(templates));
    }
  }, [templates, isLoaded, userId]);

  const addTemplate = useCallback((template) => {
    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      isDefault: false,
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplate = useCallback((id, updates) => {
    setTemplates(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTemplate = useCallback((id) => {
    // Don't allow deleting default templates
    setTemplates(prev => prev.filter(t => t.id !== id || t.isDefault));
  }, []);

  const getTemplatesByType = useCallback((type) => {
    if (!type) return templates;
    return templates.filter(t => t.type === type);
  }, [templates]);

  return {
    templates,
    isLoaded,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByType,
    defaultTemplates: DEFAULT_TEMPLATES,
  };
};
