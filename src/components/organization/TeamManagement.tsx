
import React, { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useOrganizationUsers } from '@/hooks/useOrganizationUsers';
import { useTeamInvitations } from '@/hooks/useTeamInvitations';
import { TeamMembersList } from './team/TeamMembersList';
import { InviteMemberDialog } from './team/InviteMemberDialog';
import { PendingInvitationsList } from './team/PendingInvitationsList';

export function TeamManagement() {
  const { currentOrganization } = useOrganizations();
  const { organizationUsers, updateUserRole, removeUser } = useOrganizationUsers(currentOrganization?.id);
  const { invitations, createInvitation, revokeInvitation } = useTeamInvitations(currentOrganization?.id);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleInviteUser = async (inviteData: {
    email: string;
    role: string;
    department: string;
  }) => {
    if (!currentOrganization) return;

    try {
      await createInvitation.mutateAsync({
        organization_id: currentOrganization.id,
        email: inviteData.email,
        role: inviteData.role as any,
        department: inviteData.department || null,
      });
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const handleMemberAction = (memberId: string) => {
    // Handle member actions (role changes, removal, etc.)
    console.log('Member action for:', memberId);
  };

  const handleRevokeInvitation = (invitationId: string) => {
    revokeInvitation.mutate(invitationId);
  };

  return (
    <div className="space-y-6">
      <TeamMembersList
        members={organizationUsers || []}
        onInviteMember={() => setIsInviteDialogOpen(true)}
        onMemberAction={handleMemberAction}
      />

      <PendingInvitationsList
        invitations={invitations || []}
        onRevokeInvitation={handleRevokeInvitation}
      />

      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onInvite={handleInviteUser}
      />
    </div>
  );
}
