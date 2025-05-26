
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickAccessCard() {
  const navigate = useNavigate();

  return (
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
  );
}
