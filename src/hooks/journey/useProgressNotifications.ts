
import { useState, useCallback } from 'react';

export interface ProgressNotification {
  id: string;
  type: 'step_completed' | 'module_unlocked' | 'journey_complete';
  title: string;
  message: string;
  stepId?: string;
  timestamp: Date;
}

export function useProgressNotifications() {
  const [notifications, setNotifications] = useState<ProgressNotification[]>([]);

  const addNotification = useCallback((notification: Omit<ProgressNotification, 'id' | 'timestamp'>) => {
    const newNotification: ProgressNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);

    return newNotification;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
}
