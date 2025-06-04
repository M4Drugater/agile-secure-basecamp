
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SyncResult } from './types';

export function useSyncStripe() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      console.log('Starting Stripe system repair and synchronization...');
      
      const { data, error } = await supabase.functions.invoke('sync-stripe-products');
      
      if (error) {
        throw error;
      }
      
      console.log('Repair and sync response:', data);
      setSyncResult(data);
      
      if (data.success) {
        setLastSync(new Date().toLocaleString('es-ES'));
        toast({
          title: 'Sistema Stripe Reparado',
          description: `Se han creado ${data.results?.products_created || 0} productos, ${data.results?.prices_created || 0} precios, y actualizado ${data.results?.database_updated || 0} planes en la base de datos.`,
        });
      } else {
        throw new Error(data.error || 'La reparación del sistema Stripe falló');
      }
    } catch (error) {
      console.error('Repair error:', error);
      const errorResult: SyncResult = { 
        success: false, 
        error: error.message || 'Error reparando el sistema Stripe.',
        troubleshooting: {
          stripe_configured: false,
          supabase_configured: true,
          common_solutions: [
            'Verifica que STRIPE_SECRET_KEY esté configurado en los secretos de Supabase Edge Functions',
            'Confirma que tu cuenta de Stripe esté activada',
            'Asegúrate de que tu clave API de Stripe tenga los permisos necesarios',
            'Confirma que estés usando el entorno correcto (test/live) de forma consistente'
          ]
        }
      };
      setSyncResult(errorResult);
      toast({
        title: 'Error en la Reparación',
        description: error.message || 'Error reparando el sistema Stripe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    lastSync,
    syncResult,
    handleSync
  };
}
