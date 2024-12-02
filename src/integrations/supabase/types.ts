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
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          points: number
          requirement_type: string
          requirement_value: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          points?: number
          requirement_type: string
          requirement_value: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          category_position: Json | null
          certificate_number_position: Json | null
          company_id: string | null
          course_name_position: Json | null
          created_at: string
          date_position: Json | null
          duration_position: Json | null
          id: string
          logo_position: Json | null
          signature_position: Json | null
          template_image_url: string
          updated_at: string
        }
        Insert: {
          category_position?: Json | null
          certificate_number_position?: Json | null
          company_id?: string | null
          course_name_position?: Json | null
          created_at?: string
          date_position?: Json | null
          duration_position?: Json | null
          id?: string
          logo_position?: Json | null
          signature_position?: Json | null
          template_image_url: string
          updated_at?: string
        }
        Update: {
          category_position?: Json | null
          certificate_number_position?: Json | null
          company_id?: string | null
          course_name_position?: Json | null
          created_at?: string
          date_position?: Json | null
          duration_position?: Json | null
          id?: string
          logo_position?: Json | null
          signature_position?: Json | null
          template_image_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          background_color: string | null
          created_at: string
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          sidebar_color: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          sidebar_color?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          sidebar_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_permissions: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_permissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          course_id: string
          created_at: string
          id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          category_id: string | null
          created_at: string
          description: string
          difficulty: string
          duration: number
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string
          description: string
          difficulty: string
          duration: number
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string
          difficulty?: string
          duration?: number
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_points: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          points: number
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          points: number
          source: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          points?: number
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          author: string
          categories: string[]
          cover: string
          created_at: string
          id: string
          pages: number
          pdf_url: string | null
          published_at: string
          reading_time: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          categories: string[]
          cover: string
          created_at?: string
          id?: string
          pages: number
          pdf_url?: string | null
          published_at: string
          reading_time: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          categories?: string[]
          cover?: string
          created_at?: string
          id?: string
          pages?: number
          pdf_url?: string | null
          published_at?: string
          reading_time?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          order_index: number
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          badge_color: string
          created_at: string
          icon: string
          id: string
          max_points: number | null
          min_points: number
          name: string
        }
        Insert: {
          badge_color?: string
          created_at?: string
          icon: string
          id?: string
          max_points?: number | null
          min_points: number
          name: string
        }
        Update: {
          badge_color?: string
          created_at?: string
          icon?: string
          id?: string
          max_points?: number | null
          min_points?: number
          name?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          created_at: string
          date: string
          featured_position: string | null
          id: string
          read_time: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date?: string
          featured_position?: string | null
          id?: string
          read_time: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          featured_position?: string | null
          id?: string
          read_time?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_id: string | null
          created_at: string
          department: string | null
          first_name: string | null
          id: string
          last_login_points_date: string | null
          last_name: string | null
          phone: string | null
          points: number
          position: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          id: string
          last_login_points_date?: string | null
          last_name?: string | null
          phone?: string | null
          points?: number
          position?: string | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          id?: string
          last_login_points_date?: string | null
          last_name?: string | null
          phone?: string | null
          points?: number
          position?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          options: Json
          question: string
          quiz_id: string | null
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          options: Json
          question: string
          quiz_id?: string | null
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          options?: Json
          question?: string
          quiz_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string | null
          quiz_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_correct: boolean
          question_id?: string | null
          quiz_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string | null
          quiz_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          lesson_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          created_at: string
          current_page: number
          ebook_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_page?: number
          ebook_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_page?: number
          ebook_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      support_materials: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          lesson_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          lesson_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          lesson_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
