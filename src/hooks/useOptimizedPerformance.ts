
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { usePerformanceOptimization } from './usePerformanceOptimization';

export function useOptimizedPerformance() {
  const { metrics, measurePerformance } = usePerformanceOptimization();
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current += 1;
    lastRenderTime.current = Date.now();
  });

  const optimizedCallback = useCallback(
    <T extends (...args: any[]) => any>(fn: T, delay = 100): T => {
      const timeoutRef = useRef<NodeJS.Timeout>();
      
      return ((...args: Parameters<T>) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => fn(...args), delay);
      }) as T;
    },
    []
  );

  const memoizedValue = useCallback(
    <T>(factory: () => T, deps: React.DependencyList): T => {
      return useMemo(factory, deps);
    },
    []
  );

  const performanceStats = useMemo(() => ({
    renderCount: renderCountRef.current,
    lastRenderTime: lastRenderTime.current,
    isSlowConnection: metrics.isSlowConnection,
    memoryUsage: metrics.memoryUsage,
  }), [metrics]);

  return {
    measurePerformance,
    optimizedCallback,
    memoizedValue,
    performanceStats,
    shouldOptimize: metrics.isSlowConnection || metrics.memoryUsage > 70,
  };
}
