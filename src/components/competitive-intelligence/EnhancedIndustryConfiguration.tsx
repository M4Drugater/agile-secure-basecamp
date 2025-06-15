
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Building2, Target, Lightbulb } from 'lucide-react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
  customIndustry?: string;
  subIndustries?: string[];
  competitorCompanies?: string[];
  geographicScope?: string;
  analysisDepth?: string;
}

interface EnhancedIndustryConfigurationProps {
  sessionConfig: SessionConfig;
  setSessionConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
}

const predefinedIndustries = {
  'technology': {
    name: 'Technology',
    subIndustries: ['Software', 'Hardware', 'SaaS', 'AI/ML', 'Cybersecurity', 'Fintech', 'Edtech', 'Healthtech'],
    focusAreas: ['Product Innovation', 'Market Penetration', 'Technology Stack', 'Competitive Features', 'User Acquisition'],
    keyMetrics: ['ARR Growth', 'User Acquisition Cost', 'Churn Rate', 'Feature Adoption', 'API Usage']
  },
  'finance': {
    name: 'Financial Services',
    subIndustries: ['Banking', 'Investment Management', 'Insurance', 'Payments', 'Cryptocurrency', 'RegTech'],
    focusAreas: ['Regulatory Compliance', 'Digital Transformation', 'Customer Experience', 'Risk Management', 'Product Innovation'],
    keyMetrics: ['Assets Under Management', 'Net Interest Margin', 'Customer Acquisition', 'Regulatory Capital', 'Digital Adoption']
  },
  'healthcare': {
    name: 'Healthcare & Life Sciences',
    subIndustries: ['Pharmaceuticals', 'Medical Devices', 'Digital Health', 'Biotechnology', 'Healthcare Services'],
    focusAreas: ['Regulatory Approval', 'Clinical Trials', 'Market Access', 'Patent Protection', 'Healthcare Outcomes'],
    keyMetrics: ['R&D Investment', 'Clinical Trial Success', 'Time to Market', 'Patent Portfolio', 'Market Penetration']
  },
  'retail': {
    name: 'Retail & E-commerce',
    subIndustries: ['E-commerce', 'Fashion & Apparel', 'Consumer Electronics', 'Food & Beverage', 'Luxury Goods'],
    focusAreas: ['Customer Experience', 'Supply Chain', 'Digital Commerce', 'Brand Positioning', 'Market Expansion'],
    keyMetrics: ['Same-Store Sales', 'Customer Lifetime Value', 'Inventory Turnover', 'Conversion Rate', 'Market Share']
  },
  'manufacturing': {
    name: 'Manufacturing & Industrial',
    subIndustries: ['Automotive', 'Aerospace', 'Industrial Equipment', 'Consumer Goods', 'Chemicals'],
    focusAreas: ['Operational Efficiency', 'Supply Chain', 'Product Quality', 'Sustainability', 'Automation'],
    keyMetrics: ['Production Efficiency', 'Quality Metrics', 'Supply Chain Costs', 'Innovation Pipeline', 'Safety Records']
  },
  'energy': {
    name: 'Energy & Utilities',
    subIndustries: ['Renewable Energy', 'Oil & Gas', 'Utilities', 'Energy Storage', 'Smart Grid'],
    focusAreas: ['Regulatory Environment', 'Sustainability', 'Grid Modernization', 'Energy Transition', 'Operational Efficiency'],
    keyMetrics: ['Capacity Factor', 'LCOE', 'Grid Reliability', 'Carbon Footprint', 'Regulatory Compliance']
  }
};

const geographicScopes = ['Global', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East & Africa', 'Custom Region'];

const analysisDepths = [
  { value: 'overview', label: 'Executive Overview', description: 'High-level strategic insights' },
  { value: 'detailed', label: 'Detailed Analysis', description: 'Comprehensive competitive assessment' },
  { value: 'deep-dive', label: 'Deep Dive Investigation', description: 'Exhaustive multi-framework analysis' }
];

export function EnhancedIndustryConfiguration({ sessionConfig, setSessionConfig }: EnhancedIndustryConfigurationProps) {
  const [competitorInput, setCompetitorInput] = useState('');
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);

  const selectedIndustryData = predefinedIndustries[sessionConfig.industry as keyof typeof predefinedIndustries];

  const addCompetitor = () => {
    if (competitorInput.trim()) {
      setSessionConfig(prev => ({
        ...prev,
        competitorCompanies: [...(prev.competitorCompanies || []), competitorInput.trim()]
      }));
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (index: number) => {
    setSessionConfig(prev => ({
      ...prev,
      competitorCompanies: prev.competitorCompanies?.filter((_, i) => i !== index) || []
    }));
  };

  const addSubIndustry = (subIndustry: string) => {
    setSessionConfig(prev => ({
      ...prev,
      subIndustries: [...(prev.subIndustries || []), subIndustry]
    }));
  };

  const removeSubIndustry = (index: number) => {
    setSessionConfig(prev => ({
      ...prev,
      subIndustries: prev.subIndustries?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Enhanced Industry Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Target Company *</Label>
              <Input
                id="companyName"
                placeholder="Company to analyze"
                value={sessionConfig.companyName}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="geographicScope">Geographic Scope</Label>
              <Select 
                value={sessionConfig.geographicScope || 'Global'} 
                onValueChange={(value) => setSessionConfig(prev => ({ ...prev, geographicScope: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select geographic scope" />
                </SelectTrigger>
                <SelectContent>
                  {geographicScopes.map((scope) => (
                    <SelectItem key={scope} value={scope}>{scope}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Industry Selection */}
          <div>
            <Label htmlFor="industry">Industry Sector *</Label>
            <div className="flex gap-2">
              <Select 
                value={showCustomIndustry ? 'custom' : sessionConfig.industry} 
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setShowCustomIndustry(true);
                  } else {
                    setShowCustomIndustry(false);
                    setSessionConfig(prev => ({ ...prev, industry: value, subIndustries: [] }));
                  }
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(predefinedIndustries).map(([key, industry]) => (
                    <SelectItem key={key} value={key}>{industry.name}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Industry</SelectItem>
                </SelectContent>
              </Select>
              {showCustomIndustry && (
                <Input
                  placeholder="Enter custom industry"
                  value={sessionConfig.customIndustry || ''}
                  onChange={(e) => setSessionConfig(prev => ({ ...prev, customIndustry: e.target.value }))}
                  className="flex-1"
                />
              )}
            </div>
          </div>

          {/* Sub-Industries */}
          {selectedIndustryData && (
            <div>
              <Label>Sub-Industries & Specializations</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {selectedIndustryData.subIndustries.map((subInd) => (
                  <Button
                    key={subInd}
                    variant={sessionConfig.subIndustries?.includes(subInd) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (sessionConfig.subIndustries?.includes(subInd)) {
                        removeSubIndustry(sessionConfig.subIndustries.indexOf(subInd));
                      } else {
                        addSubIndustry(subInd);
                      }
                    }}
                  >
                    {subInd}
                  </Button>
                ))}
              </div>
              {sessionConfig.subIndustries && sessionConfig.subIndustries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sessionConfig.subIndustries.map((subInd, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {subInd}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSubIndustry(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analysis Focus */}
          <div>
            <Label htmlFor="analysisFocus">Analysis Focus Area *</Label>
            <Select 
              value={sessionConfig.analysisFocus} 
              onValueChange={(value) => setSessionConfig(prev => ({ ...prev, analysisFocus: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select focus area" />
              </SelectTrigger>
              <SelectContent>
                {selectedIndustryData?.focusAreas.map((focus) => (
                  <SelectItem key={focus} value={focus}>{focus}</SelectItem>
                )) || [
                  <SelectItem key="market-share" value="market-share">Market Share Analysis</SelectItem>,
                  <SelectItem key="pricing" value="pricing">Pricing Strategy</SelectItem>,
                  <SelectItem key="product-features" value="product-features">Product Features</SelectItem>,
                  <SelectItem key="marketing" value="marketing">Marketing Strategy</SelectItem>,
                  <SelectItem key="financial" value="financial">Financial Performance</SelectItem>
                ]}
              </SelectContent>
            </Select>
          </div>

          {/* Analysis Depth */}
          <div>
            <Label htmlFor="analysisDepth">Analysis Depth</Label>
            <Select 
              value={sessionConfig.analysisDepth || 'detailed'} 
              onValueChange={(value) => setSessionConfig(prev => ({ ...prev, analysisDepth: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {analysisDepths.map((depth) => (
                  <SelectItem key={depth.value} value={depth.value}>
                    <div>
                      <div className="font-medium">{depth.label}</div>
                      <div className="text-xs text-muted-foreground">{depth.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Competitor Companies */}
          <div>
            <Label>Known Competitors (Optional)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add competitor company"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
              />
              <Button onClick={addCompetitor} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sessionConfig.competitorCompanies && sessionConfig.competitorCompanies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sessionConfig.competitorCompanies.map((competitor, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {competitor}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeCompetitor(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Strategic Objectives */}
          <div>
            <Label htmlFor="objectives">Strategic Objectives</Label>
            <Textarea
              id="objectives"
              placeholder="What specific outcomes do you want to achieve with this analysis?"
              value={sessionConfig.objectives}
              onChange={(e) => setSessionConfig(prev => ({ ...prev, objectives: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Industry Insights Preview */}
          {selectedIndustryData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Industry Intelligence Preview</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Key Metrics to Track:</span>
                    <ul className="list-disc list-inside text-blue-600 mt-1">
                      {selectedIndustryData.keyMetrics.slice(0, 3).map((metric) => (
                        <li key={metric}>{metric}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Analysis Framework:</span>
                    <div className="text-blue-600 mt-1">
                      McKinsey-level strategic analysis with industry-specific competitive intelligence
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
