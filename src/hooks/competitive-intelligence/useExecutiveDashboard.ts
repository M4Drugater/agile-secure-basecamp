import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { ExecutiveDashboardData } from './types/executiveDashboard';
import { generateExecutiveDashboardData } from './utils/dashboardDataGenerator';
import { exportDashboard, setupAutoRefresh } from './utils/dashboardOperations';

export function useExecutiveDashboard() {
  const { supabase } = useSupabase();
  const [dashboardData, setDashboardData] = useState<ExecutiveDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generateExecutiveDashboard = async (companyContext: any): Promise<ExecutiveDashboardData> => {
    setIsLoading(true);
    
    try {
      const dashboardData = generateExecutiveDashboardData(companyContext);
      return dashboardData;
    } catch (error) {
      console.error('Error generating executive dashboard:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboard = async (companyContext: any) => {
    const newData = await generateExecutiveDashboard(companyContext);
    setDashboardData(newData);
  };

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    return setupAutoRefresh(autoRefresh, dashboardData, () => {
      // In a real implementation, this would refresh with current context
    });
  }, [autoRefresh, dashboardData]);

  return {
    dashboardData,
    isLoading,
    autoRefresh,
    setAutoRefresh,
    generateExecutiveDashboard,
    refreshDashboard,
    exportDashboard
  };
}
