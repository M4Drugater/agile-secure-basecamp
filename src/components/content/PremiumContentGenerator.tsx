
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Library, 
  BarChart3,
  Crown,
  Bot
} from 'lucide-react';
import { ContentGeneratorTab } from './premium/ContentGeneratorTab';
import { ContentStylistTab } from './premium/ContentStylistTab';
import { ContentLibraryTab } from './premium/ContentLibraryTab';
import { ContentAnalyticsTab } from './premium/ContentAnalyticsTab';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';

export function PremiumContentGenerator() {
  const [activeTab, setActiveTab] = useState('generator');
  const { getContextSummary } = useContextBuilder();
  const contextSummary = getContextSummary();

  const premiumFeatures = [
    'AI-Powered Content Generation',
    'Advanced Style Transfer',
    'Template Library',
    'Content Analytics',
    'Export & Publishing',
    'Brand Voice Training'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            Premium Content Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Enterprise-grade content creation with AI intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      {/* Premium Features Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Premium Content Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="stylist" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Stylist
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <ContentGeneratorTab contextSummary={contextSummary} />
        </TabsContent>

        <TabsContent value="stylist">
          <ContentStylistTab contextSummary={contextSummary} />
        </TabsContent>

        <TabsContent value="library">
          <ContentLibraryTab />
        </TabsContent>

        <TabsContent value="analytics">
          <ContentAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
