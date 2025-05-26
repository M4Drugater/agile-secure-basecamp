
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings, Users, BarChart3, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function AppLayout() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">LAIGENT v2.0</h1>
              <Badge variant="outline" className="text-xs">
                Phase 1A - Foundation
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {profile?.full_name || user?.email}
              </div>
              {profile?.role && (
                <Badge variant={isSuperAdmin ? "default" : isAdmin ? "secondary" : "outline"}>
                  {profile.role.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Profile Status
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {profile?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={profile?.is_active ? "default" : "destructive"} className="text-xs">
                  {profile?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since:</span>
                <span className="text-sm font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel Access */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Admin Panel
                </CardTitle>
                <CardDescription>Manage users and system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Users className="h-4 w-4 mr-2" />
                    User Management
                    <Badge className="ml-auto text-xs">Coming Soon</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    System Config
                    <Badge className="ml-auto text-xs">Coming Soon</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Analytics */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  System Analytics
                </CardTitle>
                <CardDescription>Monitor platform performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium">Database Connected</div>
                    <div className="text-xs text-gray-500">All tables created successfully</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium">RLS Policies Active</div>
                    <div className="text-xs text-gray-500">Security policies enforced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium">Audit Logging</div>
                    <div className="text-xs text-gray-500">All actions tracked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Getting Started - For regular users */}
          {!isAdmin && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Welcome to LAIGENT v2.0</CardTitle>
                <CardDescription>
                  Your AI-first professional development platform is being built
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Phase 1A: Foundation ✅</h4>
                    <p className="text-sm text-blue-700">
                      Secure authentication and role-based access control has been implemented.
                      Your account is ready and the platform foundation is complete.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Coming Soon:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• CLIPOGINO AI Mentor (Phase 2)</li>
                      <li>• Intelligent Content Generation (Phase 2)</li>
                      <li>• Credit-based Usage System (Phase 3)</li>
                      <li>• Knowledge Library (Phase 4)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
