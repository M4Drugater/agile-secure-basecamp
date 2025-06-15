
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { IntegrationsManager } from '@/components/integrations/IntegrationsManager';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Zap, 
  FileText, 
  Settings2,
  Sparkles
} from 'lucide-react';

export default function EnhancedFeatures() {
  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Enhanced Features
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </h1>
        <p className="text-muted-foreground">
          Advanced AI capabilities with style control, extended thinking, knowledge search, and integrations
        </p>
        <div className="flex gap-2 mt-3">
          <Badge variant="default">Style Control</Badge>
          <Badge variant="default">Extended Thinking</Badge>
          <Badge variant="default">Advanced Search</Badge>
          <Badge variant="default">Integrations</Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Enhanced Chat
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Smart Content
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            System Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <EnhancedChatInterface />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentGenerator />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationsManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="text-center py-12">
            <Settings2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">System Configuration</h3>
            <p className="text-muted-foreground">
              Advanced system settings will be available in the next phase
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
