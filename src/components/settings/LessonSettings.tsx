import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Upload, Youtube } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonForm } from "./lessons/LessonForm";
import { SupportMaterialForm } from "./lessons/SupportMaterialForm";
import { QuizForm } from "./lessons/QuizForm";
import { LessonList } from "./lessons/LessonList";

export function LessonSettings() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Nova Aula</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="lesson" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lesson">Aula</TabsTrigger>
                <TabsTrigger value="materials">Material de Apoio</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>
              <TabsContent value="lesson">
                <LessonForm 
                  courseId={selectedCourseId}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["lessons"] });
                  }}
                />
              </TabsContent>
              <TabsContent value="materials">
                <SupportMaterialForm
                  courseId={selectedCourseId}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["lessons"] });
                  }}
                />
              </TabsContent>
              <TabsContent value="quiz">
                <QuizForm
                  courseId={selectedCourseId}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["lessons"] });
                  }}
                />
              </TabsContent>
            </Tabs>
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
        <LessonList lessons={lessons} onUpdate={() => queryClient.invalidateQueries({ queryKey: ["lessons"] })} />
      )}
    </div>
  );
}