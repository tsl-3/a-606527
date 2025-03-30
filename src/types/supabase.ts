
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
          description: string
          purpose: string
          prompt: string
          industry: string
          botFunction: string
          model: string
          avatar: string
          voice: string
          voiceProvider: string
          channels: string[] | null
          channelConfigs: Json | null
          active: boolean
          customIndustry: string | null
          customFunction: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          purpose?: string
          prompt?: string
          industry?: string
          botFunction?: string
          model?: string
          avatar?: string
          voice?: string
          voiceProvider?: string
          channels?: string[] | null
          channelConfigs?: Json | null
          active?: boolean
          customIndustry?: string | null
          customFunction?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          purpose?: string
          prompt?: string
          industry?: string
          botFunction?: string
          model?: string
          avatar?: string
          voice?: string
          voiceProvider?: string
          channels?: string[] | null
          channelConfigs?: Json | null
          active?: boolean
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
