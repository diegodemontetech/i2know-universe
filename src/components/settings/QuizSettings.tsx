import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuestionFilters } from "./quiz/QuestionFilters";
import { QuestionList } from "./quiz/QuestionList";
import { QuestionForm } from "./quiz/QuestionForm";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuizSettings() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      console.log("Fetching courses for quiz settings");
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("title");
      
      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
      
      console.log("Courses fetched:", data);
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <QuestionFilters
            selectedCategoryId={selectedCategoryId}
            selectedCourseId={selectedCourseId}
            onCategoryChange={setSelectedCategoryId}
            onCourseChange={setSelectedCourseId}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedCourseId}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Questão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Nova Questão</DialogTitle>
            </DialogHeader>
            <QuestionForm
              quizId={selectedCourseId}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!selectedCourseId ? (
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Selecione um curso para gerenciar suas questões
          </p>
        </div>
      ) : (
        <QuestionList 
          selectedCourseId={selectedCourseId}
        />
      )}
    </div>
  );
}