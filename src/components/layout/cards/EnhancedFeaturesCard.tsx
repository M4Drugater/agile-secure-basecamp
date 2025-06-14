
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Palette, 
  Search, 
  Zap 
} from 'lucide-react';

export function EnhancedFeaturesCard() {
  const navigate = useNavigate();

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20">
      <div className="absolute top-2 right-2">
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          NEW
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Enhanced Features</CardTitle>
            <CardDescription>
              Advanced AI capabilities with style control and integrations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Palette className="h-4 w-4 text-blue-600" />
              <span>Style Control</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>Extended Thinking</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <Search className="h-4 w-4 text-green-600" />
              <span>Smart Search</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>Integrations</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Experience Claude-like features with executive-level style control, 
            extended reasoning, advanced knowledge search, and webhook integrations.
          </div>
          
          <Button 
            onClick={() => navigate('/enhanced')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Explore Enhanced Features
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
