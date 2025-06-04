
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: {
    email: string;
    role: string;
    department: string;
  }) => Promise<void>;
}

export function InviteMemberDialog({ isOpen, onClose, onInvite }: InviteMemberDialogProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteDepartment, setInviteDepartment] = useState('');

  const handleInvite = async () => {
    await onInvite({
      email: inviteEmail,
      role: inviteRole,
      department: inviteDepartment,
    });
    
    setInviteEmail('');
    setInviteRole('member');
    setInviteDepartment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              value={inviteDepartment}
              onChange={(e) => setInviteDepartment(e.target.value)}
              placeholder="e.g. Engineering, Marketing"
            />
          </div>
          <Button onClick={handleInvite} className="w-full">
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
