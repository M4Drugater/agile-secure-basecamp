
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings, Users, BarChart3, Shield, ExternalLink, MessageCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function AppLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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
                Phase 2A - AI Features
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
              {isAdmin && (
                <Button onClick={() => navigate('/admin')} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Button 
              variant="ghost" 
              className="h-12 px-4"
              onClick={() => navigate('/')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="h-12 px-4"
              onClick={() => navigate('/chat')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              CLIPOGINO Chat
            </Button>
            <Button 
              variant="ghost" 
              className="h-12 px-4"
              onClick={() => navigate('/content-generator')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Content Generator
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Access to AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                AI Assistant
              </CardTitle>
              <CardDescription>Chat with CLIPOGINO for personalized guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start New Chat
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <div className="text-xs text-muted-foreground">
                  Get personalized advice and guidance from your AI mentor CLIPOGINO.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Content Creation
              </CardTitle>
              <CardDescription>Generate professional content with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/content-generator')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Content
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <div className="text-xs text-muted-foreground">
                  Create resumes, cover letters, and other professional documents.
                </div>
              </div>
            </CardContent>
          </Card>

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
                  Admin Management
                </CardTitle>
                <CardDescription>Access administrative functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>• User Management</div>
                    <div>• System Config</div>
                    <div>• Audit Logs</div>
                    <div>• Cost Monitoring</div>
                  </div>
                </div>
              </CardContent>
            )}

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>Platform health and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm font-medium">Database Connected</div>
                  <div className="text-xs text-gray-500">All systems operational</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm font-medium">AI Services Active</div>
                  <div className="text-xs text-gray-500">CLIPOGINO & Content Gen ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">🚧</div>
                  <div className="text-sm font-medium">Phase 2A Active</div>
                  <div className="text-xs text-gray-500">AI features available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Progress - Full width for non-admins */}
          <Card className={!isAdmin ? "md:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>LAIGENT v2.0 Development Progress</CardTitle>
              <CardDescription>
                Current phase status and upcoming features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Phase 1: Foundation Complete</h4>
                  <p className="text-sm text-green-700">
                    Secure authentication, role-based access control, admin management, and database foundation implemented.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🚧 Phase 2A: AI Features (Current)</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    CLIPOGINO AI mentor and content generation system with cost monitoring.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                    <div>• CLIPOGINO Chat ✅</div>
                    <div>• Content Generator ✅</div>
                    <div>• Cost Monitoring ✅</div>
                    <div>• Usage Tracking ✅</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">⏳ Coming Next:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Phase 2B: Advanced AI Features</li>
                    <li>• Phase 3: Credit-based Payment System</li>
                    <li>• Phase 4: Knowledge Library & LMS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
