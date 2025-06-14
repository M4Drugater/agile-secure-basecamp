
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Zap, 
  Globe, 
  Users, 
  TrendingUp, 
  Target,
  Loader2,
  Lightbulb
} from 'lucide-react';

interface DiscoveryEngineProps {
  onDiscoveryStart: () => void;
  onDiscoveryComplete: () => void;
}

export function DiscoveryEngine({ onDiscoveryStart, onDiscoveryComplete }: DiscoveryEngineProps) {
  const [discoveryConfig, setDiscoveryConfig] = useState({
    companyName: '',
    industry: '',
    targetMarket: '',
    keywords: '',
    geographicScope: 'global',
    discoveryDepth: 'comprehensive'
  });

  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const [discoveryStage, setDiscoveryStage] = useState('');

  const discoveryMethods = [
    {
      id: 'keyword-analysis',
      name: 'Keyword Analysis',
      description: 'Discover competitors through keyword overlap and SEO analysis',
      icon: Search,
      enabled: true
    },
    {
      id: 'market-mapping',
      name: 'Market Mapping',
      description: 'Identify competitors through market category analysis',
      icon: Globe,
      enabled: true
    },
    {
      id: 'audience-overlap',
      name: 'Audience Overlap',
      description: 'Find competitors targeting similar customer segments',
      icon: Users,
      enabled: true
    },
    {
      id: 'trend-analysis',
      name: 'Trend Analysis',
      description: 'Discover emerging competitors through trend monitoring',
      icon: TrendingUp,
      enabled: false
    }
  ];

  const handleStartDiscovery = async () => {
    if (!discoveryConfig.companyName || !discoveryConfig.industry) return;
    
    setIsDiscovering(true);
    setDiscoveryProgress(0);
    onDiscoveryStart();

    const stages = [
      'Initializing discovery engine...',
      'Analyzing market keywords...',
      'Mapping competitive landscape...',
      'Identifying audience overlaps...',
      'Validating discovered competitors...',
      'Generating competitive insights...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setDiscoveryStage(stages[i]);
      setDiscoveryProgress((i + 1) * (100 / stages.length));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsDiscovering(false);
    onDiscoveryComplete();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Discovery Configuration */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Discovery Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Your Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                value={discoveryConfig.companyName}
                onChange={(e) => setDiscoveryConfig(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={discoveryConfig.industry} onValueChange={(value) => 
                setDiscoveryConfig(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS & Software</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetMarket">Target Market Description</Label>
              <Textarea
                id="targetMarket"
                placeholder="Describe your target market, customer segments, and value proposition..."
                value={discoveryConfig.targetMarket}
                onChange={(e) => setDiscoveryConfig(prev => ({ ...prev, targetMarket: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="keywords">Keywords & Terms</Label>
              <Input
                id="keywords"
                placeholder="key terms, product categories, industry buzzwords"
                value={discoveryConfig.keywords}
                onChange={(e) => setDiscoveryConfig(prev => ({ ...prev, keywords: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Geographic Scope</Label>
                <Select value={discoveryConfig.geographicScope} onValueChange={(value) => 
                  setDiscoveryConfig(prev => ({ ...prev, geographicScope: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                    <SelectItem value="local">Local/Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Discovery Depth</Label>
                <Select value={discoveryConfig.discoveryDepth} onValueChange={(value) => 
                  setDiscoveryConfig(prev => ({ ...prev, discoveryDepth: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Quick Scan</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="deep-dive">Deep Dive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleStartDiscovery}
          disabled={!discoveryConfig.companyName || !discoveryConfig.industry || isDiscovering}
          className="w-full"
          size="lg"
        >
          {isDiscovering ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Discovering Competitors...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Start Competitor Discovery
            </>
          )}
        </Button>
      </div>

      {/* Discovery Methods & Progress */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Discovery Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {discoveryMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <method.icon className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                <Badge variant={method.enabled ? "default" : "secondary"}>
                  {method.enabled ? "Active" : "Coming Soon"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {isDiscovering && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Discovery in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={discoveryProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">{discoveryStage}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Discovery Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p>• <strong>Be specific</strong> in your target market description for better competitor matching</p>
              <p>• <strong>Include synonyms</strong> and alternative terms in your keywords</p>
              <p>• <strong>Choose comprehensive</strong> discovery for the most thorough analysis</p>
              <p>• <strong>Review and validate</strong> discovered competitors for accuracy</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
