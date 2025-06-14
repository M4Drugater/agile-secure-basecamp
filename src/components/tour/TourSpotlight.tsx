
import React, { useEffect, useState } from 'react';

interface TourSpotlightProps {
  targetElement: HTMLElement;
}

export function TourSpotlight({ targetElement }: TourSpotlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (targetElement) {
      const updateRect = () => {
        setRect(targetElement.getBoundingClientRect());
      };

      updateRect();
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect);

      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
      };
    }
  }, [targetElement]);

  if (!rect) return null;

  const padding = 8;
  const borderRadius = 12;

  return (
    <div
      className="fixed z-[9999] pointer-events-none transition-all duration-300 ease-out"
      style={{
        left: rect.left - padding,
        top: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        boxShadow: `
          0 0 0 4px rgba(99, 102, 241, 0.3),
          0 0 0 2px rgba(99, 102, 241, 0.6),
          0 0 20px rgba(99, 102, 241, 0.4)
        `,
        borderRadius: `${borderRadius}px`,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '2px solid rgba(99, 102, 241, 0.5)'
      }}
    />
  );
}
