
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Library, BarChart3, PlusCircle, TrendingUp, Zap } from 'lucide-react';

export default function Content() {
  const navigate = useNavigate();

  const contentModules = [
    {
      title: 'Content Generator',
      description: 'Create professional content with AI assistance',
      icon: FileText,
      path: '/content/generator',
      badge: 'AI Powered',
      color: 'bg-blue-500'
    },
    {
      title: 'Content Library',
      description: 'Manage and organize all your created content',
      icon: Library,
      path: '/content/library',
      badge: 'Storage',
      color: 'bg-green-500'
    },
    {
      title: 'Content Analytics',
      description: 'Track performance and engagement metrics',
      icon: BarChart3,
      path: '/content/analytics',
      badge: 'Insights',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            Content Management Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and analyze your content with AI-powered tools
          </p>
        </div>
        
        <Button onClick={() => navigate('/content/generator')} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Content
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Generated</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contentModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(module.path)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {module.badge}
                  </span>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                <Button variant="outline" className="w-full">
                  Access Module
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Executive Summary - Q4 Strategy</p>
                <p className="text-sm text-muted-foreground">Created 2 hours ago</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Monthly Analytics Report</p>
                <p className="text-sm text-muted-foreground">Generated yesterday</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
