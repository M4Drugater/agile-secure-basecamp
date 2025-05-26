export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_model_pricing: {
        Row: {
          created_at: string
          id: string
          input_cost_per_token: number
          is_active: boolean
          model_name: string
          output_cost_per_token: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_cost_per_token: number
          is_active?: boolean
          model_name: string
          output_cost_per_token: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          input_cost_per_token?: number
          is_active?: boolean
          model_name?: string
          output_cost_per_token?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          created_at: string
          error_message: string | null
          function_name: string
          id: string
          input_tokens: number
          model_name: string
          output_tokens: number
          request_duration: number | null
          status: string
          total_cost: number
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          function_name: string
          id?: string
          input_tokens?: number
          model_name: string
          output_tokens?: number
          request_duration?: number | null
          status: string
          total_cost?: number
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          function_name?: string
          id?: string
          input_tokens?: number
          model_name?: string
          output_tokens?: number
          request_duration?: number | null
          status?: string
          total_cost?: number
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          message_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          click_through_rate: number | null
          comments: number | null
          content_item_id: string
          created_at: string
          engagement_rate: number | null
          id: string
          likes: number | null
          platform: string | null
          recorded_at: string | null
          shares: number | null
          views: number | null
        }
        Insert: {
          click_through_rate?: number | null
          comments?: number | null
          content_item_id: string
          created_at?: string
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          platform?: string | null
          recorded_at?: string | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          click_through_rate?: number | null
          comments?: number | null
          content_item_id?: string
          created_at?: string
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          platform?: string | null
          recorded_at?: string | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          content: string
          content_type: string
          created_at: string
          estimated_read_time: number | null
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          published_at: string | null
          scheduled_for: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          estimated_read_time?: number | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          estimated_read_time?: number | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      content_seo_data: {
        Row: {
          analyzed_at: string | null
          content_item_id: string
          created_at: string
          focus_keywords: string[] | null
          id: string
          meta_description: string | null
          meta_title: string | null
          readability_level: string | null
          readability_score: number | null
          seo_score: number | null
          suggested_improvements: string[] | null
          updated_at: string
        }
        Insert: {
          analyzed_at?: string | null
          content_item_id: string
          created_at?: string
          focus_keywords?: string[] | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          readability_level?: string | null
          readability_score?: number | null
          seo_score?: number | null
          suggested_improvements?: string[] | null
          updated_at?: string
        }
        Update: {
          analyzed_at?: string | null
          content_item_id?: string
          created_at?: string
          focus_keywords?: string[] | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          readability_level?: string | null
          readability_score?: number | null
          seo_score?: number | null
          suggested_improvements?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_seo_data_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          changes_summary: string | null
          content: string
          content_item_id: string
          created_at: string
          created_by: string
          id: string
          title: string
          version_number: number
        }
        Insert: {
          changes_summary?: string | null
          content: string
          content_item_id: string
          created_at?: string
          created_by: string
          id?: string
          title: string
          version_number: number
        }
        Update: {
          changes_summary?: string | null
          content?: string
          content_item_id?: string
          created_at?: string
          created_by?: string
          id?: string
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_monitoring_config: {
        Row: {
          circuit_breaker_threshold: number
          created_at: string
          daily_limit: number
          id: string
          is_active: boolean
          monthly_limit: number
          per_user_daily_limit: number
          updated_at: string
        }
        Insert: {
          circuit_breaker_threshold?: number
          created_at?: string
          daily_limit?: number
          id?: string
          is_active?: boolean
          monthly_limit?: number
          per_user_daily_limit?: number
          updated_at?: string
        }
        Update: {
          circuit_breaker_threshold?: number
          created_at?: string
          daily_limit?: number
          id?: string
          is_active?: boolean
          monthly_limit?: number
          per_user_daily_limit?: number
          updated_at?: string
        }
        Relationships: []
      }
      downloadable_resources: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          download_count: number | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_documents: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          document_type: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          key_insights: string[] | null
          privacy_level: string | null
          processed_at: string | null
          processing_status: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          document_type: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          key_insights?: string[] | null
          privacy_level?: string | null
          processed_at?: string | null
          processing_status?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          key_insights?: string[] | null
          privacy_level?: string | null
          processed_at?: string | null
          processing_status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      system_knowledge_base: {
        Row: {
          category: string
          content: string
          context_triggers: string[] | null
          created_at: string
          created_by: string | null
          effectiveness_score: number | null
          embeddings: string | null
          id: string
          is_active: boolean | null
          knowledge_type: string
          last_updated_by: string | null
          metadata: Json | null
          priority: number | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category: string
          content: string
          context_triggers?: string[] | null
          created_at?: string
          created_by?: string | null
          effectiveness_score?: number | null
          embeddings?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_type: string
          last_updated_by?: string | null
          metadata?: Json | null
          priority?: number | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          context_triggers?: string[] | null
          created_at?: string
          created_by?: string | null
          effectiveness_score?: number | null
          embeddings?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_type?: string
          last_updated_by?: string | null
          metadata?: Json | null
          priority?: number | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      user_knowledge_files: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          embeddings: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_ai_processed: boolean | null
          key_insights: string[] | null
          metadata: Json | null
          processing_status: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          embeddings?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_ai_processed?: boolean | null
          key_insights?: string[] | null
          metadata?: Json | null
          processing_status?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          embeddings?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_ai_processed?: boolean | null
          key_insights?: string[] | null
          metadata?: Json | null
          processing_status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          career_goals: string[] | null
          certifications: string[] | null
          communication_style: string | null
          company: string | null
          created_at: string
          current_position: string | null
          current_skills: string[] | null
          experience_level: string | null
          feedback_preference: string | null
          full_name: string | null
          id: string
          industry: string | null
          last_updated: string | null
          leadership_experience: boolean | null
          learning_priorities: string[] | null
          learning_style: string | null
          management_level: string | null
          profile_completeness: number | null
          skill_gaps: string[] | null
          target_industry: string | null
          target_position: string | null
          target_salary_range: string | null
          team_size: number | null
          updated_at: string
          user_id: string
          work_environment: string | null
          years_of_experience: number | null
        }
        Insert: {
          career_goals?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          company?: string | null
          created_at?: string
          current_position?: string | null
          current_skills?: string[] | null
          experience_level?: string | null
          feedback_preference?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          leadership_experience?: boolean | null
          learning_priorities?: string[] | null
          learning_style?: string | null
          management_level?: string | null
          profile_completeness?: number | null
          skill_gaps?: string[] | null
          target_industry?: string | null
          target_position?: string | null
          target_salary_range?: string | null
          team_size?: number | null
          updated_at?: string
          user_id: string
          work_environment?: string | null
          years_of_experience?: number | null
        }
        Update: {
          career_goals?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          company?: string | null
          created_at?: string
          current_position?: string | null
          current_skills?: string[] | null
          experience_level?: string | null
          feedback_preference?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          leadership_experience?: boolean | null
          learning_priorities?: string[] | null
          learning_style?: string | null
          management_level?: string | null
          profile_completeness?: number | null
          skill_gaps?: string[] | null
          target_industry?: string | null
          target_position?: string | null
          target_salary_range?: string | null
          team_size?: number | null
          updated_at?: string
          user_id?: string
          work_environment?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_profile_completeness: {
        Args: {
          profile_row: Database["public"]["Tables"]["user_profiles"]["Row"]
        }
        Returns: number
      }
      get_monthly_cost: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_daily_cost: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_daily_cost: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_download_count: {
        Args: { resource_id: string }
        Returns: undefined
      }
      increment_knowledge_usage: {
        Args: { knowledge_id: string }
        Returns: undefined
      }
      increment_message_count: {
        Args: { conversation_id: string }
        Returns: number
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_role: "super_admin" | "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["super_admin", "admin", "user"],
    },
  },
} as const
