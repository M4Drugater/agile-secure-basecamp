
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Trash } from 'lucide-react';

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  department: string | null;
  expires_at: string | null;
}

interface PendingInvitationCardProps {
  invitation: PendingInvitation;
  onRevoke: (invitationId: string) => void;
}

export function PendingInvitationCard({ invitation, onRevoke }: PendingInvitationCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <Mail className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium">{invitation.email}</p>
          <p className="text-sm text-muted-foreground">
            Invited as {invitation.role}
            {invitation.department && ` • ${invitation.department}`}
          </p>
          <p className="text-xs text-muted-foreground">
            Expires: {new Date(invitation.expires_at!).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRevoke(invitation.id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
