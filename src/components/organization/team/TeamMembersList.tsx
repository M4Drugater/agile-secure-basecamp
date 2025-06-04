
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMemberCard } from './TeamMemberCard';

interface TeamMember {
  id: string;
  role: string | null;
  department: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

interface TeamMembersListProps {
  members: TeamMember[];
  onInviteMember: () => void;
  onMemberAction?: (memberId: string) => void;
}

export function TeamMembersList({ members, onInviteMember, onMemberAction }: TeamMembersListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your organization's team members and their roles
          </CardDescription>
        </div>
        <button 
          onClick={onInviteMember}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Invite Member
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members?.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              onAction={onMemberAction}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
