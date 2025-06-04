
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Euro } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function StripeSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Stripe synchronization...');
      
      const { data, error } = await supabase.functions.invoke('initialize-test-data');
      
      if (error) {
        throw error;
      }
      
      console.log('Sync response:', data);
      
      setLastSync(new Date().toLocaleString('es-ES'));
      toast({
        title: 'Sincronización Exitosa',
        description: `Se han sincronizado ${data.plans?.length || 0} planes con Stripe en EUR.`,
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Error de Sincronización',
        description: error.message || 'Error al sincronizar con Stripe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Euro className="w-5 h-5 mr-2" />
          Sincronización con Stripe
        </CardTitle>
        <CardDescription>
          Sincroniza los planes de suscripción con tus productos de Stripe en EUR
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Estado de Sincronización</div>
            <div className="text-sm text-muted-foreground">
              {lastSync ? `Última sincronización: ${lastSync}` : 'Nunca sincronizado'}
            </div>
          </div>
          <Badge variant="outline" className="flex items-center">
            <Euro className="w-3 h-3 mr-1" />
            EUR
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Productos configurados:</strong>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Pro (prod_RRxuCJBN3M2XL5)</li>
            <li>• T Leadership (prod_RRxrSQAeJfVMWH)</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar con Stripe
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Esta acción actualizará los planes de suscripción con los precios actuales de Stripe en EUR.
        </div>
      </CardContent>
    </Card>
  );
}
