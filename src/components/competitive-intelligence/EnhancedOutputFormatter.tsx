
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  BarChart3, 
  FileText, 
  Download,
  Share,
  BookOpen,
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';

interface AnalysisSection {
  title: string;
  content: string;
  confidence: number;
  sources: string[];
  framework?: string;
}

interface StrategicRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  impact: string;
  effort: string;
}

interface CompetitiveThreat {
  company: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  probability: number;
  impact: string;
  timeframe: string;
}

interface MarketOpportunity {
  title: string;
  description: string;
  potential: 'high' | 'medium' | 'low';
  feasibility: number;
  timeToMarket: string;
  investment: string;
}

interface EnhancedAnalysisOutput {
  executiveSummary: string;
  keyFindings: string[];
  strategicAnalysis: AnalysisSection[];
  recommendations: StrategicRecommendation[];
  threats: CompetitiveThreat[];
  opportunities: MarketOpportunity[];
  confidenceScore: number;
  frameworks: string[];
  sources: string[];
  timestamp: string;
  agentType: string;
}

interface EnhancedOutputFormatterProps {
  output: EnhancedAnalysisOutput;
  companyName: string;
  agentType: string;
}

export function EnhancedOutputFormatter({ output, companyName, agentType }: EnhancedOutputFormatterProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': case 'critical': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const agentNames = {
    cdv: 'Competitor Discovery & Validation',
    cir: 'Competitive Intelligence Retrieval',
    cia: 'Competitive Intelligence Analysis'
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Strategic Intelligence Report
          </h2>
          <p className="text-gray-600">
            {agentNames[agentType as keyof typeof agentNames]} • {companyName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Confidence: {output.confidenceScore}%
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-1" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed">{output.executiveSummary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Key Strategic Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {output.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{finding}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Analysis Sections */}
      {output.strategicAnalysis.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {section.framework && (
                  <Badge variant="outline">{section.framework}</Badge>
                )}
                <Badge variant="secondary">
                  {section.confidence}% Confidence
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-4">
              <div className="whitespace-pre-wrap text-gray-700">{section.content}</div>
            </div>
            {section.sources.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Sources: </span>
                <span className="text-xs text-gray-500">{section.sources.join(', ')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Strategic Recommendations */}
      {output.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {output.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{rec.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Timeframe: {rec.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Impact: {rec.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Effort: {rec.effort}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitive Threats */}
      {output.threats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Competitive Threats Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {output.threats.map((threat, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-lg ${getThreatLevelColor(threat.threatLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{threat.company}</h4>
                    <Badge variant="outline" className="text-xs">
                      {threat.threatLevel.toUpperCase()} THREAT
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{threat.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <span>Probability: {threat.probability}%</span>
                    <span>Impact: {threat.impact}</span>
                    <span>Timeframe: {threat.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Opportunities */}
      {output.opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Target className="h-5 w-5" />
              Market Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {output.opportunities.map((opp, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{opp.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {opp.potential.toUpperCase()} POTENTIAL
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{opp.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Feasibility: {opp.feasibility}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>Time to Market: {opp.timeToMarket}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-purple-500" />
                      <span>Investment: {opp.investment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Metadata */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <BookOpen className="h-5 w-5" />
            Analysis Methodology & Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-medium mb-2">Frameworks Applied</h5>
              <div className="space-y-1">
                {output.frameworks.map((framework) => (
                  <Badge key={framework} variant="outline" className="text-xs">
                    {framework}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Data Sources</h5>
              <div className="text-xs text-gray-600">
                {output.sources.join(', ')}
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Analysis Details</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Generated: {output.timestamp}</div>
                <div>Agent: {agentNames[agentType as keyof typeof agentNames]}</div>
                <div>Confidence: {output.confidenceScore}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
