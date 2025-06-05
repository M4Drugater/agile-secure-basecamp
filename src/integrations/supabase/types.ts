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
      ai_learning_insights: {
        Row: {
          action_items: string[] | null
          confidence_score: number | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          insight_type: string
          is_active: boolean | null
          supporting_data: Json | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_items?: string[] | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          insight_type: string
          is_active?: boolean | null
          supporting_data?: Json | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_items?: string[] | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_active?: boolean | null
          supporting_data?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_learning_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      assessment_attempts: {
        Row: {
          ai_feedback: Json | null
          answers: Json
          assessment_id: string | null
          attempt_number: number
          created_at: string
          detailed_results: Json | null
          id: string
          score: number | null
          started_at: string | null
          submitted_at: string | null
          time_taken_minutes: number | null
          user_id: string | null
        }
        Insert: {
          ai_feedback?: Json | null
          answers?: Json
          assessment_id?: string | null
          attempt_number: number
          created_at?: string
          detailed_results?: Json | null
          id?: string
          score?: number | null
          started_at?: string | null
          submitted_at?: string | null
          time_taken_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          ai_feedback?: Json | null
          answers?: Json
          assessment_id?: string | null
          attempt_number?: number
          created_at?: string
          detailed_results?: Json | null
          id?: string
          score?: number | null
          started_at?: string | null
          submitted_at?: string | null
          time_taken_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "learning_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          metadata: Json | null
          related_function: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          related_function?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          related_function?: string | null
          transaction_type?: string
          user_id?: string
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
      knowledge_base_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
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
      knowledge_processing_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_id: string
          file_type: string
          id: string
          max_attempts: number | null
          priority: number | null
          processing_type: string
          scheduled_for: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_id: string
          file_type: string
          id?: string
          max_attempts?: number | null
          priority?: number | null
          processing_type?: string
          scheduled_for?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_id?: string
          file_type?: string
          id?: string
          max_attempts?: number | null
          priority?: number | null
          processing_type?: string
          scheduled_for?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          learning_path_id: string | null
          module_id: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          learning_path_id?: string | null
          module_id?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          learning_path_id?: string | null
          module_id?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_analytics_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_analytics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_assessments: {
        Row: {
          adaptive_difficulty: boolean | null
          ai_generated: boolean | null
          assessment_type: string | null
          created_at: string
          description: string | null
          id: string
          is_proctored: boolean | null
          max_attempts: number | null
          module_id: string | null
          passing_score: number | null
          questions: Json
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          adaptive_difficulty?: boolean | null
          ai_generated?: boolean | null
          assessment_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_proctored?: boolean | null
          max_attempts?: number | null
          module_id?: string | null
          passing_score?: number | null
          questions?: Json
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          adaptive_difficulty?: boolean | null
          ai_generated?: boolean | null
          assessment_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_proctored?: boolean | null
          max_attempts?: number | null
          module_id?: string | null
          passing_score?: number | null
          questions?: Json
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_assessments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_certificates: {
        Row: {
          blockchain_hash: string | null
          certificate_data: Json | null
          certificate_number: string
          certificate_template_id: string | null
          created_at: string
          expiry_date: string | null
          id: string
          is_revoked: boolean | null
          issued_date: string | null
          learning_path_id: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          blockchain_hash?: string | null
          certificate_data?: Json | null
          certificate_number: string
          certificate_template_id?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_revoked?: boolean | null
          issued_date?: string | null
          learning_path_id?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          blockchain_hash?: string | null
          certificate_data?: Json | null
          certificate_number?: string
          certificate_template_id?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_revoked?: boolean | null
          issued_date?: string | null
          learning_path_id?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_certificates_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          ai_enhanced_content: string | null
          content: string | null
          created_at: string
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          is_required: boolean | null
          learning_path_id: string | null
          module_type: string | null
          order_index: number
          passing_score: number | null
          personalization_data: Json | null
          resources: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_enhanced_content?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_required?: boolean | null
          learning_path_id?: string | null
          module_type?: string | null
          order_index: number
          passing_score?: number | null
          personalization_data?: Json | null
          resources?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_enhanced_content?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_required?: boolean | null
          learning_path_id?: string | null
          module_type?: string | null
          order_index?: number
          passing_score?: number | null
          personalization_data?: Json | null
          resources?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_modules_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          average_rating: number | null
          completion_rate: number | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          enrollment_count: number | null
          estimated_duration_hours: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          learning_objectives: string[] | null
          metadata: Json | null
          prerequisites: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          completion_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          enrollment_count?: number | null
          estimated_duration_hours?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          metadata?: Json | null
          prerequisites?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          completion_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          enrollment_count?: number | null
          estimated_duration_hours?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          metadata?: Json | null
          prerequisites?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_progress: {
        Row: {
          ai_feedback: Json | null
          attempts: number | null
          completed_at: string | null
          created_at: string
          first_accessed_at: string | null
          id: string
          interaction_data: Json | null
          learning_path_id: string | null
          module_id: string | null
          progress_percentage: number | null
          score: number | null
          status: string | null
          time_spent_minutes: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_feedback?: Json | null
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          first_accessed_at?: string | null
          id?: string
          interaction_data?: Json | null
          learning_path_id?: string | null
          module_id?: string | null
          progress_percentage?: number | null
          score?: number | null
          status?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_feedback?: Json | null
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          first_accessed_at?: string | null
          id?: string
          interaction_data?: Json | null
          learning_path_id?: string | null
          module_id?: string | null
          progress_percentage?: number | null
          score?: number | null
          status?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          career_goals: string[] | null
          certifications: string[] | null
          communication_style: string | null
          company: string | null
          created_at: string | null
          current_position: string | null
          current_skills: string[] | null
          email: string
          experience_level: string | null
          feedback_preference: string | null
          full_name: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          last_login: string | null
          last_updated: string | null
          leadership_experience: boolean | null
          learning_priorities: string[] | null
          learning_style: string | null
          management_level: string | null
          profile_completeness: number | null
          role: Database["public"]["Enums"]["user_role"]
          skill_gaps: string[] | null
          target_industry: string | null
          target_position: string | null
          target_salary_range: string | null
          team_size: number | null
          updated_at: string | null
          work_environment: string | null
          years_of_experience: number | null
        }
        Insert: {
          career_goals?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          company?: string | null
          created_at?: string | null
          current_position?: string | null
          current_skills?: string[] | null
          email: string
          experience_level?: string | null
          feedback_preference?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_updated?: string | null
          leadership_experience?: boolean | null
          learning_priorities?: string[] | null
          learning_style?: string | null
          management_level?: string | null
          profile_completeness?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          skill_gaps?: string[] | null
          target_industry?: string | null
          target_position?: string | null
          target_salary_range?: string | null
          team_size?: number | null
          updated_at?: string | null
          work_environment?: string | null
          years_of_experience?: number | null
        }
        Update: {
          career_goals?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          company?: string | null
          created_at?: string | null
          current_position?: string | null
          current_skills?: string[] | null
          email?: string
          experience_level?: string | null
          feedback_preference?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_updated?: string | null
          leadership_experience?: boolean | null
          learning_priorities?: string[] | null
          learning_style?: string | null
          management_level?: string | null
          profile_completeness?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          skill_gaps?: string[] | null
          target_industry?: string | null
          target_position?: string | null
          target_salary_range?: string | null
          team_size?: number | null
          updated_at?: string | null
          work_environment?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          credits_per_month: number
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          max_daily_credits: number
          name: string
          price_monthly: number
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_per_month?: number
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_daily_credits?: number
          name: string
          price_monthly: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_per_month?: number
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_daily_credits?: number
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
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
          is_template: boolean | null
          knowledge_type: string
          last_updated_by: string | null
          metadata: Json | null
          parent_id: string | null
          priority: number | null
          source_type: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          version: number | null
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
          is_template?: boolean | null
          knowledge_type: string
          last_updated_by?: string | null
          metadata?: Json | null
          parent_id?: string | null
          priority?: number | null
          source_type?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          version?: number | null
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
          is_template?: boolean | null
          knowledge_type?: string
          last_updated_by?: string | null
          metadata?: Json | null
          parent_id?: string | null
          priority?: number | null
          source_type?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_knowledge_base_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "system_knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          id: string
          last_reset_date: string | null
          total_credits: number
          updated_at: string
          used_credits_today: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_reset_date?: string | null
          total_credits?: number
          updated_at?: string
          used_credits_today?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_reset_date?: string | null
          total_credits?: number
          updated_at?: string
          used_credits_today?: number
          user_id?: string
        }
        Relationships: []
      }
      user_knowledge_files: {
        Row: {
          ai_analysis: Json | null
          ai_key_points: string[] | null
          ai_summary: string | null
          content: string | null
          created_at: string
          description: string | null
          document_category: string | null
          embeddings: string | null
          error_details: string | null
          extracted_content: string | null
          extraction_status: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_ai_processed: boolean | null
          is_template: boolean | null
          key_insights: string[] | null
          metadata: Json | null
          original_file_name: string | null
          parent_id: string | null
          processing_metadata: Json | null
          processing_status: string | null
          source_type: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_key_points?: string[] | null
          ai_summary?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          document_category?: string | null
          embeddings?: string | null
          error_details?: string | null
          extracted_content?: string | null
          extraction_status?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_ai_processed?: boolean | null
          is_template?: boolean | null
          key_insights?: string[] | null
          metadata?: Json | null
          original_file_name?: string | null
          parent_id?: string | null
          processing_metadata?: Json | null
          processing_status?: string | null
          source_type?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_key_points?: string[] | null
          ai_summary?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          document_category?: string | null
          embeddings?: string | null
          error_details?: string | null
          extracted_content?: string | null
          extraction_status?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_ai_processed?: boolean | null
          is_template?: boolean | null
          key_insights?: string[] | null
          metadata?: Json | null
          original_file_name?: string | null
          parent_id?: string | null
          processing_metadata?: Json | null
          processing_status?: string | null
          source_type?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_knowledge_files_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_knowledge_files"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_progress: {
        Row: {
          ai_recommendations: Json | null
          best_streak_days: number | null
          completion_date: string | null
          created_at: string
          current_module_id: string | null
          current_streak_days: number | null
          enrollment_date: string | null
          id: string
          last_activity_at: string | null
          learning_path_id: string | null
          performance_metrics: Json | null
          progress_percentage: number | null
          status: string | null
          time_spent_minutes: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_recommendations?: Json | null
          best_streak_days?: number | null
          completion_date?: string | null
          created_at?: string
          current_module_id?: string | null
          current_streak_days?: number | null
          enrollment_date?: string | null
          id?: string
          last_activity_at?: string | null
          learning_path_id?: string | null
          performance_metrics?: Json | null
          progress_percentage?: number | null
          status?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_recommendations?: Json | null
          best_streak_days?: number | null
          completion_date?: string | null
          created_at?: string
          current_module_id?: string | null
          current_streak_days?: number | null
          enrollment_date?: string | null
          id?: string
          last_activity_at?: string | null
          learning_path_id?: string | null
          performance_metrics?: Json | null
          progress_percentage?: number | null
          status?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_progress_current_module_id_fkey"
            columns: ["current_module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_learning_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_learning_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_plan_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          user_uuid: string
          credits_to_add: number
          description_text?: string
        }
        Returns: undefined
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_learning_path_progress: {
        Args: { path_id: string; user_uuid: string }
        Returns: number
      }
      calculate_profile_completeness: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: number
      }
      consume_credits: {
        Args: {
          user_uuid: string
          credits_to_consume: number
          function_name: string
          description_text?: string
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_knowledge_recommendations: {
        Args: { search_text: string; user_uuid?: string }
        Returns: {
          id: string
          title: string
          description: string
          content_snippet: string
          knowledge_type: string
          relevance_score: number
        }[]
      }
      get_monthly_cost: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_daily_cost: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_conversations: {
        Args: { user_uuid: string }
        Returns: {
          id: string
          title: string
          created_at: string
          updated_at: string
          message_count: number
        }[]
      }
      get_user_credit_status: {
        Args: { user_uuid: string }
        Returns: {
          total_credits: number
          used_today: number
          daily_limit: number
          subscription_status: string
          plan_name: string
        }[]
      }
      get_user_daily_cost: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_user_organization: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      has_organization_permission: {
        Args: { _organization_id: string; _required_role?: string }
        Returns: boolean
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
      increment_system_knowledge_usage: {
        Args: { doc_id: string }
        Returns: undefined
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      reset_daily_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      user_has_org_access: {
        Args: { org_id: string; required_role?: string }
        Returns: boolean
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
