
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PendingInvitationCard } from './PendingInvitationCard';

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  department: string | null;
  expires_at: string | null;
}

interface PendingInvitationsListProps {
  invitations: PendingInvitation[];
  onRevokeInvitation: (invitationId: string) => void;
}

export function PendingInvitationsList({ invitations, onRevokeInvitation }: PendingInvitationsListProps) {
  if (!invitations || invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Manage outstanding team invitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <PendingInvitationCard
              key={invitation.id}
              invitation={invitation}
              onRevoke={onRevokeInvitation}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
