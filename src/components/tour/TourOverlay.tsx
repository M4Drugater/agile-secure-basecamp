
import React, { useEffect, useState } from 'react';
import { useTour } from '@/contexts/TourContext';
import { TourTooltip } from './TourTooltip';
import { TourSpotlight } from './TourSpotlight';

export function TourOverlay() {
  const { isActive, currentStep, steps } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const target = steps[currentStep].target;
    const element = document.querySelector(target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center' 
      });
    }
  }, [isActive, currentStep, steps]);

  if (!isActive || !steps[currentStep] || !targetElement) {
    return null;
  }

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300" />
      
      {/* Spotlight effect */}
      <TourSpotlight targetElement={targetElement} />
      
      {/* Tooltip */}
      <TourTooltip 
        step={steps[currentStep]} 
        targetElement={targetElement}
        stepNumber={currentStep + 1}
        totalSteps={steps.length}
      />
    </>
  );
}
