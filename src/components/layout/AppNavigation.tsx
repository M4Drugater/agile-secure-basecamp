
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, MessageCircle, FileText, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppNavigation() {
  const navigate = useNavigate();

  return (
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
            onClick={() => navigate('/profile')}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button 
            variant="ghost" 
            className="h-12 px-4"
            onClick={() => navigate('/knowledge-base')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Knowledge Base
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
  );
}
