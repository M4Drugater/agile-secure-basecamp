
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  ExternalLink,
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  Building,
  Calendar,
  Target
} from 'lucide-react';

interface DiscoveryResultsProps {
  validatedCompetitors: number;
}

interface ValidatedCompetitor {
  id: string;
  name: string;
  website: string;
  description: string;
  industry: string;
  competitorType: 'direct' | 'indirect' | 'substitute';
  threatLevel: 'high' | 'medium' | 'low';
  marketPosition: string;
  foundingYear: string;
  headquarters: string;
  keyMetrics: {
    traffic: string;
    employees: string;
    revenue: string;
    growth: string;
    marketShare: string;
  };
  strengths: string[];
  weaknesses: string[];
  discoveryDate: string;
}

export function DiscoveryResults({ validatedCompetitors }: DiscoveryResultsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterThreat, setFilterThreat] = useState('all');

  const [competitors] = useState<ValidatedCompetitor[]>([
    {
      id: '1',
      name: 'TechFlow Solutions',
      website: 'techflow.com',
      description: 'Cloud-based workflow automation platform for enterprise teams',
      industry: 'SaaS & Software',
      competitorType: 'direct',
      threatLevel: 'high',
      marketPosition: 'Market Leader',
      foundingYear: '2019',
      headquarters: 'San Francisco, CA',
      keyMetrics: {
        traffic: '2.3M monthly visits',
        employees: '120-150',
        revenue: '$10-25M ARR',
        growth: '+45% YoY',
        marketShare: '12%'
      },
      strengths: ['Strong enterprise sales', 'Advanced automation features', 'Excellent customer support'],
      weaknesses: ['High pricing', 'Complex onboarding', 'Limited integrations'],
      discoveryDate: '2024-06-14'
    },
    {
      id: '2',
      name: 'Enterprise Connect',
      website: 'enterpriseconnect.com',
      description: 'Enterprise communication and project management suite',
      industry: 'SaaS & Software',
      competitorType: 'direct',
      threatLevel: 'high',
      marketPosition: 'Established Player',
      foundingYear: '2017',
      headquarters: 'New York, NY',
      keyMetrics: {
        traffic: '5.1M monthly visits',
        employees: '250-300',
        revenue: '$50-100M ARR',
        growth: '+28% YoY',
        marketShare: '18%'
      },
      strengths: ['Large user base', 'Comprehensive feature set', 'Strong brand recognition'],
      weaknesses: ['Outdated UI', 'Slow innovation', 'Poor mobile experience'],
      discoveryDate: '2024-06-14'
    },
    {
      id: '3',
      name: 'FlexiWork Hub',
      website: 'flexiwork.io',
      description: 'Flexible workspace management and team coordination platform',
      industry: 'SaaS & Software',
      competitorType: 'indirect',
      threatLevel: 'medium',
      marketPosition: 'Niche Player',
      foundingYear: '2020',
      headquarters: 'Remote-first',
      keyMetrics: {
        traffic: '890K monthly visits',
        employees: '45-60',
        revenue: '$5-10M ARR',
        growth: '+85% YoY',
        marketShare: '3%'
      },
      strengths: ['Innovative features', 'Remote-first approach', 'Competitive pricing'],
      weaknesses: ['Limited enterprise features', 'Small team', 'Marketing reach'],
      discoveryDate: '2024-06-14'
    }
  ]);

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competitor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || competitor.competitorType === filterType;
    const matchesThreat = filterThreat === 'all' || competitor.threatLevel === filterThreat;
    
    return matchesSearch && matchesType && matchesThreat;
  });

  const getThreatBadge = (threat: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[threat as keyof typeof colors]}>{threat} threat</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      direct: 'bg-purple-100 text-purple-800',
      indirect: 'bg-blue-100 text-blue-800',
      substitute: 'bg-orange-100 text-orange-800'
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Validated Competitors
            </CardTitle>
            <Badge variant="outline">{filteredCompetitors.length} competitors found</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Competitor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="indirect">Indirect</SelectItem>
                <SelectItem value="substitute">Substitute</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterThreat} onValueChange={setFilterThreat}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Threat Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Threats</SelectItem>
                <SelectItem value="high">High Threat</SelectItem>
                <SelectItem value="medium">Medium Threat</SelectItem>
                <SelectItem value="low">Low Threat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Results */}
      <div className="space-y-4">
        {filteredCompetitors.map((competitor) => (
          <Card key={competitor.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{competitor.name}</h3>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.website}</p>
                  <p className="text-sm">{competitor.description}</p>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(competitor.competitorType)}
                    {getThreatBadge(competitor.threatLevel)}
                    <Badge variant="outline">{competitor.marketPosition}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Monthly Traffic</div>
                    <div className="text-sm font-medium">{competitor.keyMetrics.traffic}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Team Size</div>
                    <div className="text-sm font-medium">{competitor.keyMetrics.employees}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Est. Revenue</div>
                    <div className="text-sm font-medium">{competitor.keyMetrics.revenue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Growth Rate</div>
                    <div className="text-sm font-medium">{competitor.keyMetrics.growth}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Market Share</div>
                    <div className="text-sm font-medium">{competitor.keyMetrics.marketShare}</div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Founded in {competitor.foundingYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{competitor.headquarters}</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {competitor.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Weaknesses</h4>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompetitors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No competitors found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or filters to find relevant competitors
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
