
import { useDashboardData } from './useDashboardData';

export function useDashboardMetrics() {
  const { dashboardMetrics, profile } = useDashboardData();

  const getProfileCompletionColor = () => {
    const completeness = dashboardMetrics.profileCompleteness;
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfileCompletionMessage = () => {
    const completeness = dashboardMetrics.profileCompleteness;
    if (completeness >= 80) return 'Perfil completado';
    if (completeness >= 50) return 'Perfil parcialmente completado';
    return 'Perfil incompleto';
  };

  return {
    ...dashboardMetrics,
    profileCompletionColor: getProfileCompletionColor(),
    profileCompletionMessage: getProfileCompletionMessage(),
    userName: profile?.full_name?.split(' ')[0] || 'Usuario'
  };
}
