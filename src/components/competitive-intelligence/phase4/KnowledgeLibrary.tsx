
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Brain,
  Star,
  Download,
  Eye,
  Clock,
  Filter,
  Lightbulb,
  Target
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: 'framework' | 'case_study' | 'template' | 'research' | 'best_practice';
  type: 'document' | 'video' | 'interactive' | 'template';
  rating: number;
  downloads: number;
  views: number;
  publishDate: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  aiEnhanced: boolean;
}

export function KnowledgeLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'McKinsey Strategic Assessment Framework',
      description: 'Comprehensive framework for strategic competitive analysis with AI-enhanced insights',
      category: 'framework',
      type: 'interactive',
      rating: 4.9,
      downloads: 1247,
      views: 3420,
      publishDate: '2024-01-15',
      difficulty: 'advanced',
      tags: ['strategy', 'mckinsey', 'framework', 'assessment'],
      aiEnhanced: true
    },
    {
      id: '2',
      title: 'Competitive Intelligence Best Practices Guide',
      description: 'Industry-leading best practices for competitive intelligence gathering and analysis',
      category: 'best_practice',
      type: 'document',
      rating: 4.8,
      downloads: 892,
      views: 2134,
      publishDate: '2024-01-20',
      difficulty: 'intermediate',
      tags: ['best-practices', 'intelligence', 'methodology'],
      aiEnhanced: true
    },
    {
      id: '3',
      title: 'Market Entry Strategy Template',
      description: 'Ready-to-use template for market entry analysis with competitive positioning',
      category: 'template',
      type: 'template',
      rating: 4.7,
      downloads: 1567,
      views: 4321,
      publishDate: '2024-01-10',
      difficulty: 'beginner',
      tags: ['template', 'market-entry', 'strategy'],
      aiEnhanced: false
    },
    {
      id: '4',
      title: 'Fortune 500 Competitive Analysis Case Study',
      description: 'Real-world case study of competitive analysis in the technology sector',
      category: 'case_study',
      type: 'document',
      rating: 4.6,
      downloads: 734,
      views: 1876,
      publishDate: '2024-01-25',
      difficulty: 'advanced',
      tags: ['case-study', 'fortune-500', 'technology'],
      aiEnhanced: true
    },
    {
      id: '5',
      title: 'Real-Time Intelligence Monitoring Research',
      description: 'Latest research on real-time competitive intelligence and monitoring systems',
      category: 'research',
      type: 'document',
      rating: 4.5,
      downloads: 456,
      views: 1234,
      publishDate: '2024-01-30',
      difficulty: 'advanced',
      tags: ['research', 'real-time', 'monitoring'],
      aiEnhanced: true
    },
    {
      id: '6',
      title: 'Executive Decision Making Masterclass',
      description: 'Video series on strategic decision making for competitive advantage',
      category: 'best_practice',
      type: 'video',
      rating: 4.8,
      downloads: 0,
      views: 2876,
      publishDate: '2024-02-01',
      difficulty: 'intermediate',
      tags: ['decision-making', 'executive', 'strategy'],
      aiEnhanced: true
    }
  ]);

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'framework': return 'bg-blue-500';
      case 'case_study': return 'bg-green-500';
      case 'template': return 'bg-purple-500';
      case 'research': return 'bg-orange-500';
      case 'best_practice': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Eye className="h-4 w-4" />;
      case 'interactive': return <Brain className="h-4 w-4" />;
      case 'template': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories', count: knowledgeItems.length },
    { id: 'framework', label: 'Frameworks', count: knowledgeItems.filter(i => i.category === 'framework').length },
    { id: 'case_study', label: 'Case Studies', count: knowledgeItems.filter(i => i.category === 'case_study').length },
    { id: 'template', label: 'Templates', count: knowledgeItems.filter(i => i.category === 'template').length },
    { id: 'research', label: 'Research', count: knowledgeItems.filter(i => i.category === 'research').length },
    { id: 'best_practice', label: 'Best Practices', count: knowledgeItems.filter(i => i.category === 'best_practice').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            AI-Powered Knowledge Library
          </h2>
          <p className="text-muted-foreground">
            Comprehensive repository of competitive intelligence resources and frameworks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI-Enhanced Content
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {knowledgeItems.length} Resources
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filters
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        {item.title}
                        {item.aiEnhanced && (
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge 
                      variant="secondary"
                      className={`${getCategoryColor(item.category)} text-white text-xs`}
                    >
                      {item.category.replace('_', ' ')}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`${getDifficultyColor(item.difficulty)} text-xs`}
                    >
                      {item.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Rating and Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {item.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      {item.type === 'video' ? 'Watch' : 'View'}
                    </Button>
                    {item.type !== 'video' && (
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </div>

                  {/* Publish Date */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(item.publishDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filters.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
