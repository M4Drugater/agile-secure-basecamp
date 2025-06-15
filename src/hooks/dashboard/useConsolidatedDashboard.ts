
import { useDashboardData } from './useDashboardData';
import { useDashboardMetrics } from './useDashboardMetrics';

export function useConsolidatedDashboard() {
  const dashboardData = useDashboardData();
  const dashboardMetrics = useDashboardMetrics();

  const getSystemHealth = () => {
    const { profileCompleteness, documentsUploaded, chatInteractions } = dashboardMetrics;
    
    const healthScore = Math.round(
      (profileCompleteness + (documentsUploaded * 10) + (chatInteractions * 5)) / 3
    );

    let status: 'excellent' | 'good' | 'needs-attention' = 'needs-attention';
    if (healthScore >= 80) status = 'excellent';
    else if (healthScore >= 50) status = 'good';

    return {
      score: healthScore,
      status,
      recommendations: generateRecommendations(profileCompleteness, documentsUploaded, chatInteractions)
    };
  };

  const generateRecommendations = (profile: number, docs: number, chats: number) => {
    const recommendations = [];
    
    if (profile < 80) {
      recommendations.push({
        type: 'profile',
        priority: 'high',
        message: 'Completa tu perfil profesional para mejores recomendaciones'
      });
    }
    
    if (docs < 3) {
      recommendations.push({
        type: 'knowledge',
        priority: 'medium',
        message: 'Sube documentos para enriquecer tu base de conocimiento'
      });
    }
    
    if (chats < 5) {
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        message: 'Inicia más conversaciones con CLIPOGINO'
      });
    }

    return recommendations;
  };

  return {
    ...dashboardData,
    ...dashboardMetrics,
    systemHealth: getSystemHealth(),
  };
}
