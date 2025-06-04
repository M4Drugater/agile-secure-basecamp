
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function AppHeader() {
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
    <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 sticky top-0 z-40 mt-16">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 ml-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-gradient">LAIGENT</h1>
                <p className="text-xs text-muted-foreground -mt-1">v2.0</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-accent/10 border-accent/20 text-accent hover-lift">
              Phase 2A - AI Features
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{profile?.full_name || user?.email}</span>
            </div>
            {profile?.role && (
              <Badge 
                variant={isSuperAdmin ? "default" : isAdmin ? "secondary" : "outline"}
                className={`${isSuperAdmin ? 'bg-gradient-primary text-white' : ''} hover-lift`}
              >
                {profile.role.replace('_', ' ').toUpperCase()}
              </Badge>
            )}
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')} 
                variant="outline" 
                size="sm"
                className="btn-enhanced hover-lift"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              size="sm"
              className="btn-enhanced hover-lift"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
