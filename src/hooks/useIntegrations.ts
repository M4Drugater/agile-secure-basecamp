
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

interface NewIntegration {
  name: string;
  type: 'webhook' | 'zapier' | 'api';
  url: string;
  description?: string;
}

export function useIntegrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load integrations from localStorage (for now, later we'll use Supabase)
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`integrations_${user.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setIntegrations(parsed.map((int: any) => ({
            ...int,
            lastTriggered: int.lastTriggered ? new Date(int.lastTriggered) : undefined
          })));
        } catch (error) {
          console.error('Error loading integrations:', error);
        }
      }
    }
  }, [user]);

  // Save integrations to localStorage
  const saveIntegrations = (newIntegrations: Integration[]) => {
    if (user) {
      localStorage.setItem(`integrations_${user.id}`, JSON.stringify(newIntegrations));
      setIntegrations(newIntegrations);
    }
  };

  const addIntegration = async (newIntegration: NewIntegration): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const integration: Integration = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      ...newIntegration,
      status: 'active'
    };

    const updated = [...integrations, integration];
    saveIntegrations(updated);
  };

  const removeIntegration = async (integrationId: string): Promise<void> => {
    const updated = integrations.filter(int => int.id !== integrationId);
    saveIntegrations(updated);
  };

  const testIntegration = async (integrationId: string): Promise<void> => {
    const integration = integrations.find(int => int.id === integrationId);
    if (!integration) throw new Error('Integration not found');

    setIsLoading(true);
    try {
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        integration_name: integration.name,
        user_id: user?.id,
        message: 'Test message from LAIGENT'
      };

      const response = await fetch(integration.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Handle CORS for external webhooks
        body: JSON.stringify(testPayload),
      });

      // Update integration status
      const updated = integrations.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'active' as const, lastTriggered: new Date() }
          : int
      );
      saveIntegrations(updated);

    } catch (error) {
      console.error('Integration test failed:', error);
      
      // Update integration status to error
      const updated = integrations.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'error' as const }
          : int
      );
      saveIntegrations(updated);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const triggerIntegration = async (integrationId: string, data: any): Promise<void> => {
    const integration = integrations.find(int => int.id === integrationId);
    if (!integration || integration.status !== 'active') return;

    try {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        integration_name: integration.name,
        user_id: user?.id
      };

      await fetch(integration.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      // Update last triggered time
      const updated = integrations.map(int => 
        int.id === integrationId 
          ? { ...int, lastTriggered: new Date() }
          : int
      );
      saveIntegrations(updated);

    } catch (error) {
      console.error('Failed to trigger integration:', error);
    }
  };

  const triggerAllIntegrations = async (event: string, data: any): Promise<void> => {
    const activeIntegrations = integrations.filter(int => int.status === 'active');
    
    const payload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      user_id: user?.id
    };

    await Promise.allSettled(
      activeIntegrations.map(integration => 
        triggerIntegration(integration.id, payload)
      )
    );
  };

  return {
    integrations,
    isLoading,
    addIntegration,
    removeIntegration,
    testIntegration,
    triggerIntegration,
    triggerAllIntegrations
  };
}
