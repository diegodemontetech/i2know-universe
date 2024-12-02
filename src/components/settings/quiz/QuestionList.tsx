import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { QuestionItem } from "./QuestionItem";
import { QuestionPagination } from "./QuestionPagination";
import { QuizPreview } from "./QuizPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuestionListProps {
  selectedCourseId: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

const ITEMS_PER_PAGE = 5;

export function QuestionList({ selectedCourseId }: QuestionListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ["questions", selectedCourseId],
    queryFn: async () => {
      console.log("Fetching questions for course:", selectedCourseId);
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", selectedCourseId);
      
      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }
      
      console.log("Questions fetched:", data);
      return {
        questions: data.map((question): QuizQuestion => ({
          ...question,
          options: Array.isArray(question.options) 
            ? question.options.map(String)
            : [],
        })),
        total: data.length,
      };
    },
    enabled: !!selectedCourseId,
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting question:", id);
      const { error } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({
        title: "Questão excluída",
        description: "A questão foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error deleting question:", error);
      toast({
        title: "Erro ao excluir questão",
        description: "Ocorreu um erro ao tentar excluir a questão.",
        variant: "destructive",
      });
    },
  });

  if (!selectedCourseId) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Selecione um curso para gerenciar suas questões
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-3 w-1/2" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!questionsData || questionsData.questions.length === 0) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Nenhuma questão encontrada para este curso
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(questionsData.total / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = questionsData.questions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              Visualizar Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Preview do Quiz</DialogTitle>
            </DialogHeader>
            <QuizPreview questions={questionsData.questions} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {paginatedQuestions.map((question) => (
          <QuestionItem
            key={question.id}
            id={question.id}
            question={question.question}
            options={question.options}
            correctAnswer={question.correct_answer}
            onDelete={(id) => deleteQuestionMutation.mutate(id)}
            onUpdate={() => queryClient.invalidateQueries({ queryKey: ["questions"] })}
          />
        ))}
      </div>

      <QuestionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}