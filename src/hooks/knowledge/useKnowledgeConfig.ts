
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useKnowledgeConfig() {
  const queryClient = useQueryClient();

  const {
    data: config,
    isLoading: isLoadingConfig
  } = useQuery({
    queryKey: ['knowledgeConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_base_config')
        .select('*')
        .eq('is_active', true)
        .order('config_key');

      if (error) {
        // Non-admin users won't have access, that's expected
        console.log('Config access denied (expected for non-admin users)');
        return [];
      }
      return data || [];
    },
  });

  const updateConfig = useMutation({
    mutationFn: async ({
      configKey,
      configValue,
      description
    }: {
      configKey: string;
      configValue: any;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('knowledge_base_config')
        .upsert({
          config_key: configKey,
          config_value: configValue,
          description: description,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeConfig'] });
      toast({
        title: "Configuration Updated",
        description: "Knowledge base configuration has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating config:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update configuration.",
        variant: "destructive",
      });
    },
  });

  return {
    config,
    isLoadingConfig,
    updateConfig: updateConfig.mutate,
    isUpdatingConfig: updateConfig.isPending,
  };
}
