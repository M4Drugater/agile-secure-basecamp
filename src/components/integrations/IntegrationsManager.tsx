
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Webhook, 
  Zap, 
  Globe, 
  Settings, 
  Plus, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useIntegrations } from '@/hooks/useIntegrations';
import { toast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'zapier' | 'api';
  url: string;
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: Date;
  description?: string;
}

export function IntegrationsManager() {
  const { integrations, addIntegration, removeIntegration, testIntegration } = useIntegrations();
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'webhook' as const,
    url: '',
    description: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddIntegration = async () => {
    if (!newIntegration.name || !newIntegration.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      await addIntegration(newIntegration);
      setNewIntegration({ name: '', type: 'webhook', url: '', description: '' });
      toast({
        title: "Success",
        description: "Integration added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add integration",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleTestIntegration = async (integration: Integration) => {
    try {
      await testIntegration(integration.id);
      toast({
        title: "Test Successful",
        description: `${integration.name} responded correctly`
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: `Failed to test ${integration.name}`,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook': return <Webhook className="h-4 w-4" />;
      case 'zapier': return <Zap className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrations & Webhooks</h2>
          <p className="text-muted-foreground">
            Connect LAIGENT with external services and automation tools
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {integrations.length} Active
        </Badge>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList>
          <TabsTrigger value="manage">Manage Integrations</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {integrations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No integrations configured</h3>
                <p className="text-muted-foreground mb-4">
                  Connect external services to automate your workflow
                </p>
                <Button variant="outline" onClick={() => setNewIntegration({ ...newIntegration })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Integration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getTypeIcon(integration.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {integration.description || integration.url}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {integration.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {integration.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestIntegration(integration)}
                        >
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeIntegration(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{integration.type.toUpperCase()}</Badge>
                      </div>
                      {integration.lastTriggered && (
                        <div className="text-muted-foreground">
                          Last triggered: {integration.lastTriggered.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Integration Name</label>
                <Input
                  placeholder="e.g., My Zapier Webhook"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as any })}
                >
                  <option value="webhook">Generic Webhook</option>
                  <option value="zapier">Zapier</option>
                  <option value="api">Custom API</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                <Input
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={newIntegration.url}
                  onChange={(e) => setNewIntegration({ ...newIntegration, url: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                <Input
                  placeholder="What does this integration do?"
                  value={newIntegration.description}
                  onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                />
              </div>

              <Button 
                onClick={handleAddIntegration} 
                disabled={isAdding || !newIntegration.name || !newIntegration.url}
                className="w-full"
              >
                {isAdding ? 'Adding...' : 'Add Integration'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Zapier Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect to thousands of apps through Zapier
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Trigger when content is created</li>
                  <li>• Send data to Google Sheets</li>
                  <li>• Post to social media</li>
                  <li>• Email notifications</li>
                </ul>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Custom Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send data to your own applications
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Real-time data sync</li>
                  <li>• Custom business logic</li>
                  <li>• CRM integration</li>
                  <li>• Analytics tracking</li>
                </ul>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
