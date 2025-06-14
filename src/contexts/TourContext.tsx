
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector or element ID
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
  optional?: boolean;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  isCompleted: boolean;
  progress: number;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: React.ReactNode;
  steps: TourStep[];
}

export function TourProvider({ children, steps }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if tour was completed before
  useEffect(() => {
    const completed = localStorage.getItem('tour-completed');
    if (completed === 'true') {
      setIsCompleted(true);
    }
  }, []);

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    document.body.style.overflow = 'auto';
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    localStorage.setItem('tour-completed', 'true');
    setIsCompleted(true);
    endTour();
  }, [endTour]);

  const completeTour = useCallback(() => {
    localStorage.setItem('tour-completed', 'true');
    setIsCompleted(true);
    endTour();
  }, [endTour]);

  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <TourContext.Provider value={{
      isActive,
      currentStep,
      steps,
      startTour,
      endTour,
      nextStep,
      prevStep,
      skipTour,
      completeTour,
      isCompleted,
      progress
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
