import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonListProps {
  selectedCourseId: string;
}

export function LessonList({ selectedCourseId }: LessonListProps) {
  const { toast } = useToast();

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons", selectedCourseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          support_materials(*),
          quizzes(
            *,
            quiz_questions(*)
          )
        `)
        .eq("course_id", selectedCourseId)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCourseId,
  });

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

  if (!selectedCourseId) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Selecione um curso para gerenciar suas aulas
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Carregando aulas...
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