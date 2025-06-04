
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface TeamMember {
  id: string;
  role: string | null;
  department: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onAction?: (memberId: string) => void;
}

export function TeamMemberCard({ member, onAction }: TeamMemberCardProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'secondary';
      case 'manager': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{member.profiles?.full_name || 'Unknown User'}</p>
          <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
          {member.department && (
            <p className="text-xs text-muted-foreground">{member.department}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={getRoleBadgeVariant(member.role!)}>
          {member.role}
        </Badge>
        {member.role !== 'owner' && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onAction?.(member.id)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
