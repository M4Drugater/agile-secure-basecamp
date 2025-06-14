
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  ExternalLink,
  Globe,
  Users,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface ValidationDashboardProps {
  pendingValidation: number;
  onValidationComplete: () => void;
}

interface CompetitorCandidate {
  id: string;
  name: string;
  website: string;
  description: string;
  industry: string;
  estimatedSize: string;
  foundingYear: string;
  headquarters: string;
  confidence: number;
  discoveryMethod: string;
  keyMetrics: {
    traffic: string;
    employees: string;
    revenue: string;
    growth: string;
  };
  validationChecks: {
    websiteActive: boolean;
    businessModel: boolean;
    targetMarket: boolean;
    competitive: boolean;
  };
}

export function ValidationDashboard({ pendingValidation, onValidationComplete }: ValidationDashboardProps) {
  const [candidates] = useState<CompetitorCandidate[]>([
    {
      id: '1',
      name: 'TechFlow Solutions',
      website: 'techflow.com',
      description: 'Cloud-based workflow automation platform for enterprise teams',
      industry: 'SaaS & Software',
      estimatedSize: 'Medium (50-200 employees)',
      foundingYear: '2019',
      headquarters: 'San Francisco, CA',
      confidence: 87,
      discoveryMethod: 'Keyword Analysis',
      keyMetrics: {
        traffic: '2.3M monthly visits',
        employees: '120-150',
        revenue: '$10-25M ARR',
        growth: '+45% YoY'
      },
      validationChecks: {
        websiteActive: true,
        businessModel: true,
        targetMarket: true,
        competitive: true
      }
    },
    {
      id: '2',
      name: 'WorkSpace Pro',
      website: 'workspacepro.io',
      description: 'Digital workspace platform with integrated collaboration tools',
      industry: 'SaaS & Software',
      estimatedSize: 'Small (10-50 employees)',
      foundingYear: '2021',
      headquarters: 'Austin, TX',
      confidence: 72,
      discoveryMethod: 'Market Mapping',
      keyMetrics: {
        traffic: '450K monthly visits',
        employees: '25-35',
        revenue: '$2-5M ARR',
        growth: '+120% YoY'
      },
      validationChecks: {
        websiteActive: true,
        businessModel: true,
        targetMarket: false,
        competitive: true
      }
    },
    {
      id: '3',
      name: 'Enterprise Connect',
      website: 'enterpriseconnect.com',
      description: 'Enterprise communication and project management suite',
      industry: 'SaaS & Software',
      estimatedSize: 'Large (200+ employees)',
      foundingYear: '2017',
      headquarters: 'New York, NY',
      confidence: 91,
      discoveryMethod: 'Audience Overlap',
      keyMetrics: {
        traffic: '5.1M monthly visits',
        employees: '250-300',
        revenue: '$50-100M ARR',
        growth: '+28% YoY'
      },
      validationChecks: {
        websiteActive: true,
        businessModel: true,
        targetMarket: true,
        competitive: true
      }
    }
  ]);

  const handleValidateCompetitor = (competitorId: string, isValid: boolean) => {
    if (isValid) {
      onValidationComplete();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
    if (confidence >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Validation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Competitor Validation Queue
            </span>
            <Badge variant="outline">{candidates.length} pending validation</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{candidates.filter(c => c.confidence >= 80).length}</div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{candidates.filter(c => c.confidence >= 60 && c.confidence < 80).length}</div>
              <div className="text-sm text-muted-foreground">Medium Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{candidates.filter(c => c.confidence < 60).length}</div>
              <div className="text-sm text-muted-foreground">Low Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Candidates */}
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.website}</p>
                  <p className="text-sm">{candidate.description}</p>
                </div>
                <div className="text-right space-y-2">
                  {getConfidenceBadge(candidate.confidence)}
                  <div className={`text-sm font-medium ${getConfidenceColor(candidate.confidence)}`}>
                    {candidate.confidence}% match
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Traffic</div>
                    <div className="text-sm font-medium">{candidate.keyMetrics.traffic}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Employees</div>
                    <div className="text-sm font-medium">{candidate.keyMetrics.employees}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                    <div className="text-sm font-medium">{candidate.keyMetrics.revenue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                    <div className="text-sm font-medium">{candidate.keyMetrics.growth}</div>
                  </div>
                </div>
              </div>

              {/* Validation Checks */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Validation Checks</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(candidate.validationChecks).map(([check, passed]) => (
                    <div key={check} className="flex items-center gap-2">
                      {passed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs capitalize">{check.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Discovered via {candidate.discoveryMethod}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleValidateCompetitor(candidate.id, false)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleValidateCompetitor(candidate.id, true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Validate as Competitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
