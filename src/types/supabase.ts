
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          purpose: string | null
          prompt: string | null
          industry: string | null
          botFunction: string | null
          model: string | null
          avatar: string | null
          voice: string | null
          voiceProvider: string | null
          channels: string[] | null
          channelConfigs: Json | null
          active: boolean | null
          customIndustry: string | null
          customFunction: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          purpose?: string | null
          prompt?: string | null
          industry?: string | null
          botFunction?: string | null
          model?: string | null
          avatar?: string | null
          voice?: string | null
          voiceProvider?: string | null
          channels?: string[] | null
          channelConfigs?: Json | null
          active?: boolean | null
          customIndustry?: string | null
          customFunction?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          purpose?: string | null
          prompt?: string | null
          industry?: string | null
          botFunction?: string | null
          model?: string | null
          avatar?: string | null
          voice?: string | null
          voiceProvider?: string | null
          channels?: string[] | null
          channelConfigs?: Json | null
          active?: boolean | null
          customIndustry?: string | null
          customFunction?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
