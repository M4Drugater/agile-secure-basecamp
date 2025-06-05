
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DownloadableResource {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_path?: string;
  tags?: string[];
  download_count: number;
  is_featured: boolean;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export function useDownloadableResources() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: resources,
    isLoading,
    error
  } = useQuery({
    queryKey: ['downloadableResources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloadable_resources')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('download_count', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const downloadResource = useMutation({
    mutationFn: async (resourceId: string) => {
      const { error } = await supabase.rpc('increment_download_count', {
        resource_id: resourceId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloadableResources'] });
      toast({
        title: "Download started",
        description: "The resource download has been initiated.",
      });
    },
    onError: (error) => {
      console.error('Error downloading resource:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the resource. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    resources,
    isLoading,
    error,
    downloadResource: downloadResource.mutate,
    isDownloading: downloadResource.isPending,
  };
}
