import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { LessonForm } from "./LessonForm";
import { LessonList } from "./LessonList";

export function LessonSettings() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery({
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

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={selectedCourseId}
          onValueChange={setSelectedCourseId}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecione o curso" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedCourseId}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Aula
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Aula</DialogTitle>
            </DialogHeader>
            <LessonForm
              courseId={selectedCourseId}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!selectedCourseId ? (
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Selecione um curso para gerenciar suas aulas
          </p>
        </div>
      ) : isLoadingLessons ? (
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Carregando aulas...
          </p>
        </div>
      ) : (
        <LessonList 
          lessons={lessons} 
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
          }} 
        />
      )}
    </div>
  );
}