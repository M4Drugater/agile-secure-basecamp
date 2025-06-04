
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { toast } from '@/hooks/use-toast';

export function OrganizationSwitcher() {
  const { currentOrganization, organizations, createOrganization, switchOrganization } = useOrganizations();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [orgIndustry, setOrgIndustry] = useState('');

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrganization.mutateAsync({
        name: orgName,
        slug: orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: orgDescription || null,
        industry: orgIndustry || null,
      });

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      setIsCreateDialogOpen(false);
      setOrgName('');
      setOrgDescription('');
      setOrgIndustry('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleSwitchOrganization = async (orgId: string) => {
    try {
      await switchOrganization.mutateAsync(orgId);
      toast({
        title: "Success",
        description: "Switched organization successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch organization",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="truncate">
                {currentOrganization?.name || 'Select Organization'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="start">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations?.map((org) => (
            <DropdownMenuItem 
              key={org.id} 
              className="cursor-pointer"
              onClick={() => handleSwitchOrganization(org.id)}
            >
              <Building2 className="h-4 w-4 mr-2" />
              <span className="truncate flex-1">{org.name}</span>
              {currentOrganization?.id === org.id && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label htmlFor="org-industry">Industry (Optional)</Label>
              <Input
                id="org-industry"
                value={orgIndustry}
                onChange={(e) => setOrgIndustry(e.target.value)}
                placeholder="e.g. Technology, Healthcare"
              />
            </div>
            <div>
              <Label htmlFor="org-description">Description (Optional)</Label>
              <Textarea
                id="org-description"
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                placeholder="Brief description of your organization"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateOrganization}
                disabled={createOrganization.isPending}
              >
                Create Organization
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
