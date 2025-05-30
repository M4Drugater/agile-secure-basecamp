
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { QuickAccessCard } from './cards/QuickAccessCard';
import { ContentCreationCard } from './cards/ContentCreationCard';
import { UserProfileCard } from './cards/UserProfileCard';
import { ProfileCompletionCard } from './cards/ProfileCompletionCard';
import { KnowledgeBaseCard } from './cards/KnowledgeBaseCard';
import { LearningManagementCard } from './cards/LearningManagementCard';
import { AdminPanelCard } from './cards/AdminPanelCard';
import { SystemStatusCard } from './cards/SystemStatusCard';
import { DevelopmentProgressCard } from './cards/DevelopmentProgressCard';

export function DashboardCards() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <QuickAccessCard />
      <ProfileCompletionCard />
      <KnowledgeBaseCard />
      <LearningManagementCard />
      <ContentCreationCard />
      <UserProfileCard />
      
      {isAdmin && <AdminPanelCard />}
      
      <SystemStatusCard />
      <DevelopmentProgressCard isAdmin={isAdmin} />
    </div>
  );
}
