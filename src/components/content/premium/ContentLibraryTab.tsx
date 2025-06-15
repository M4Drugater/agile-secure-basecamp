
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Library, 
  FileText, 
  Star, 
  Search,
  Filter,
  Plus,
  Calendar,
  Tag
} from 'lucide-react';

export function ContentLibraryTab() {
  const mockContent = [
    {
      id: 1,
      title: 'Q3 Strategic Review - Board Presentation',
      type: 'Presentation',
      created: '2 days ago',
      quality: 95,
      tags: ['Strategy', 'Q3', 'Board'],
      favorite: true
    },
    {
      id: 2,
      title: 'Market Expansion Analysis - Executive Summary',
      type: 'Executive Memo',
      created: '1 week ago',
      quality: 92,
      tags: ['Market', 'Expansion', 'Analysis'],
      favorite: false
    },
    {
      id: 3,
      title: 'Competitive Intelligence Report - Fintech Sector',
      type: 'Report',
      created: '2 weeks ago',
      quality: 88,
      tags: ['Competitive', 'Fintech', 'Intelligence'],
      favorite: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                Content Library
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and organize your generated content
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New Content
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your content library..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContent.map((item) => (
          <Card key={item.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {item.type}
                    <Calendar className="h-3 w-3 ml-2" />
                    {item.created}
                  </div>
                </div>
                {item.favorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Quality Score</span>
                  <Badge variant="default" className="text-xs">
                    {item.quality}%
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Premium Templates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Professional templates for common business content
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Executive Summary Template',
              'Board Presentation Template',
              'Strategic Plan Template'
            ].map((template, index) => (
              <Card key={index} className="p-4 border-dashed">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium text-sm mb-1">{template}</h4>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
