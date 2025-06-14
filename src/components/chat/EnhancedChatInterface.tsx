
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Search, 
  Palette, 
  Brain, 
  Settings, 
  Zap 
} from 'lucide-react';
import { ConsolidatedChat } from './ConsolidatedChat';
import { AdvancedKnowledgeSearch } from '@/components/knowledge/AdvancedKnowledgeSearch';
import { StyleSelector } from '@/components/content/StyleSelector';
import { ExtendedThinkingToggle } from './ExtendedThinkingToggle';

interface ChatSettings {
  style: string;
  extendedThinking: boolean;
  knowledgeSearch: boolean;
}

export function EnhancedChatInterface() {
  const [activeTab, setActiveTab] = useState('chat');
  const [settings, setSettings] = useState<ChatSettings>({
    style: 'executive',
    extendedThinking: false,
    knowledgeSearch: true
  });

  const handleSettingChange = (key: keyof ChatSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleKnowledgeResultSelect = (result: any) => {
    // This could be used to insert the result into the chat context
    console.log('Selected knowledge result:', result);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Enhanced AI Chat
            <Zap className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground">
            Advanced AI assistant with style control, extended thinking, and knowledge integration
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={settings.extendedThinking ? 'default' : 'secondary'}>
            <Brain className="h-3 w-3 mr-1" />
            Extended Thinking
          </Badge>
          <Badge variant="outline">
            <Palette className="h-3 w-3 mr-1" />
            {settings.style}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Knowledge Search
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Style Control
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <ConsolidatedChat />
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <AdvancedKnowledgeSearch onResultSelect={handleKnowledgeResultSelect} />
        </TabsContent>

        <TabsContent value="style" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Content Style & Communication</h3>
              <p className="text-muted-foreground">
                Configure how CLIPOGINO communicates and generates content
              </p>
            </CardHeader>
            <CardContent>
              <StyleSelector
                selectedStyle={settings.style}
                onStyleChange={(style) => handleSettingChange('style', style)}
                showDetails={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <ExtendedThinkingToggle
              enabled={settings.extendedThinking}
              onToggle={(enabled) => handleSettingChange('extendedThinking', enabled)}
              showDescription={true}
            />

            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Knowledge Integration</h3>
                <p className="text-muted-foreground">
                  Control how CLIPOGINO uses your knowledge base
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto Knowledge Search</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically search knowledge base for relevant context
                      </p>
                    </div>
                    <Button
                      variant={settings.knowledgeSearch ? 'default' : 'outline'}
                      onClick={() => handleSettingChange('knowledgeSearch', !settings.knowledgeSearch)}
                    >
                      {settings.knowledgeSearch ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Performance Settings</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Style:</strong> {settings.style}
                  </div>
                  <div>
                    <strong>Extended Thinking:</strong> {settings.extendedThinking ? 'On' : 'Off'}
                  </div>
                  <div>
                    <strong>Knowledge Search:</strong> {settings.knowledgeSearch ? 'On' : 'Off'}
                  </div>
                  <div>
                    <strong>Response Time:</strong> {settings.extendedThinking ? '20-30s' : '3-5s'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
