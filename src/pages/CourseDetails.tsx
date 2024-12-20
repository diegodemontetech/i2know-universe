import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { LessonList } from "@/components/course/LessonList";

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
  const session = useSession();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

      if (error) {
        console.error("Error fetching lessons:", error);
        throw error;
      }
      return data as Lesson[];
    },
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["course-progress", id, session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("course_id", id)
        .eq("user_id", session?.user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching progress:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress: number) => {
      if (!session?.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("course_progress")
        .upsert({
          user_id: session.user.id,
          course_id: id,
          progress: newProgress,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
      toast({
        title: "Progresso atualizado",
        description: "Seu progresso foi salvo com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Error updating progress:", error);
      toast({
        title: "Erro ao atualizar progresso",
        description: "Ocorreu um erro ao salvar seu progresso.",
        variant: "destructive",
      });
    },
  });

  const handleLessonComplete = () => {
    if (!lessons.length) return;
    
    const totalLessons = lessons.length;
    const currentIndex = lessons.findIndex(lesson => lesson.id === selectedLesson?.id);
    const newProgress = Math.round(((currentIndex + 1) / totalLessons) * 100);
    
    updateProgressMutation.mutate(newProgress);

    // Se for a última aula, redirecionar para o quiz final
    if (currentIndex === lessons.length - 1) {
      // TODO: Implementar redirecionamento para o quiz final
      toast({
        title: "Curso concluído!",
        description: "Parabéns! Agora você pode fazer o quiz final.",
      });
    } else {
      // Avança para a próxima aula
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

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
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Curso não encontrado</h2>
        <p className="text-muted-foreground mt-2">
          O curso que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="flex-1 bg-black rounded-lg overflow-hidden">
        <VideoPlayer
          youtubeUrl={selectedLesson?.youtube_url}
          onComplete={handleLessonComplete}
          isLastLesson={selectedLesson && lessons.indexOf(selectedLesson) === lessons.length - 1}
        />
      </div>

      <LessonList
        course={course}
        lessons={lessons}
        selectedLesson={selectedLesson}
        progress={progress}
        onSelectLesson={setSelectedLesson}
      />
    </div>
  );
}
