import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Play, Clock, BarChart, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  order_index: number;
  quizzes: Array<{
    id: string;
    title: string;
  }>;
}

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      console.log("Fetching course details for id:", id);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching course:", error);
        throw error;
      }
      
      return data;
    },
  });

  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery({
    queryKey: ["course-lessons", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          quizzes (
            id,
            title
          )
        `)
        .eq("course_id", id)
        .order("order_index");

      if (error) throw error;
      return data as Lesson[];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["course-progress", id, session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("course_id", id)
        .eq("user_id", session?.user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-[40vh] bg-card rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-card rounded w-1/3" />
          <div className="h-4 bg-card rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!course) {
    return <div>Curso não encontrado</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Video Player Section */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden">
        {selectedLesson?.youtube_url ? (
          <iframe
            src={`https://www.youtube.com/embed/${selectedLesson.youtube_url.split("v=")[1]}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Selecione uma aula para começar
          </div>
        )}
      </div>

      {/* Lessons List Section */}
      <div className="w-80 bg-card rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">{course.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
            <BarChart className="w-4 h-4 ml-2" />
            <span>{course.difficulty}</span>
          </div>
          {progress && (
            <div className="mt-4">
              <Progress value={progress.progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {progress.progress}% completo
              </p>
            </div>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-4 space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedLesson?.id === lesson.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lesson.title}</span>
                  {lesson.quizzes.length > 0 && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      Quiz
                    </span>
                  )}
                </div>
                {lesson.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {lesson.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}