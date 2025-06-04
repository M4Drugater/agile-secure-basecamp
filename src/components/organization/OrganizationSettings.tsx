
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useForm } from 'react-hook-form';
import { Building2, CreditCard, Users, Calendar } from 'lucide-react';

interface OrganizationForm {
  name: string;
  description: string;
  industry: string;
  size_category: string;
  billing_email: string;
}

export function OrganizationSettings() {
  const { currentOrganization, updateOrganization } = useOrganizations();
  
  const { register, handleSubmit, formState: { isDirty } } = useForm<OrganizationForm>({
    defaultValues: {
      name: currentOrganization?.name || '',
      description: currentOrganization?.description || '',
      industry: currentOrganization?.industry || '',
      size_category: currentOrganization?.size_category || '',
      billing_email: currentOrganization?.billing_email || '',
    },
  });

  const onSubmit = async (data: OrganizationForm) => {
    if (!currentOrganization) return;
    
    try {
      await updateOrganization.mutateAsync({
        id: currentOrganization.id,
        ...data,
      });
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  if (!currentOrganization) {
    return <div>Please select an organization</div>;
  }

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="default" className="text-sm">
                {currentOrganization.subscription_tier?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Current plan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentOrganization.max_users}</div>
            <p className="text-xs text-muted-foreground">
              User limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Ends</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentOrganization.trial_ends_at 
                ? new Date(currentOrganization.trial_ends_at).toLocaleDateString()
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Trial period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Organization Details
          </CardTitle>
          <CardDescription>
            Manage your organization's basic information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <Label htmlFor="billing_email">Billing Email</Label>
                <Input
                  id="billing_email"
                  type="email"
                  {...register('billing_email')}
                  placeholder="billing@company.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your organization"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  {...register('industry')}
                  placeholder="e.g. Technology, Healthcare"
                />
              </div>
              <div>
                <Label htmlFor="size_category">Company Size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10)</SelectItem>
                    <SelectItem value="small">Small (11-50)</SelectItem>
                    <SelectItem value="medium">Medium (51-200)</SelectItem>
                    <SelectItem value="large">Large (201-1000)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={!isDirty || updateOrganization.isPending}>
              {updateOrganization.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
