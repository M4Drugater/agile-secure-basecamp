
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  isSlowConnection: boolean;
  memoryUsage: number;
  renderTime: number;
}

export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isSlowConnection: false,
    memoryUsage: 0,
    renderTime: 0,
  });

  useEffect(() => {
    // Check connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      setMetrics(prev => ({ ...prev, isSlowConnection }));
      
      if (isSlowConnection) {
        toast({
          title: "Slow connection detected",
          description: "Some features may load more slowly. Consider switching to a faster network.",
        });
      }
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const memoryUsage = (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100;
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      if (memoryUsage > 80) {
        toast({
          title: "High memory usage",
          description: "Consider refreshing the page if you experience performance issues.",
          variant: "destructive",
        });
      }
    }

    // Measure render performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({ ...prev, renderTime: entry.duration }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const measurePerformance = (name: string, fn: () => void) => {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  };

  return {
    metrics,
    measurePerformance,
  };
}
