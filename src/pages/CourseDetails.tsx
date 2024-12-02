import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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

  // Seleciona a primeira aula quando o curso é carregado
  React.useEffect(() => {
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

  const handleLessonComplete = () => {
    if (!lessons.length) return;
    
    const totalLessons = lessons.length;
    const currentIndex = lessons.findIndex(lesson => lesson.id === selectedLesson?.id);
    const newProgress = Math.round(((currentIndex + 1) / totalLessons) * 100);
    
    updateProgressMutation.mutate(newProgress);

    // Avança para a próxima aula se existir
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Video Player Section */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden">
        {selectedLesson?.youtube_url ? (
          <div className="relative h-full">
            <iframe
              src={`https://www.youtube.com/embed/${selectedLesson.youtube_url.split("v=")[1]}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Button
              className="absolute bottom-4 right-4"
              onClick={handleLessonComplete}
            >
              Concluir Aula
            </Button>
          </div>
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