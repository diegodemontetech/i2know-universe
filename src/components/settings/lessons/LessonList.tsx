import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  order_index: number;
  course_id: string | null;
  created_at: string;
  updated_at: string;
  support_materials: Array<{
    id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    created_at: string;
    updated_at: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

interface LessonListProps {
  lessons: Lesson[];
  onUpdate: () => void;
}

export function LessonList({ lessons, onUpdate }: LessonListProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Aula excluída com sucesso!" });
      onUpdate();
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir aula",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!lessons.length) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Nenhuma aula encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border"
        >
          <div className="space-y-1">
            <h4 className="font-medium">{lesson.title}</h4>
            {lesson.description && (
              <p className="text-sm text-muted-foreground">
                {lesson.description}
              </p>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{lesson.support_materials.length} materiais</span>
              <span>{lesson.quizzes.length} quizzes</span>
            </div>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(lesson.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}