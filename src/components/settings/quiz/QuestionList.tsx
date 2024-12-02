import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface QuestionListProps {
  selectedCourseId: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export function QuestionList({ selectedCourseId }: QuestionListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["questions", selectedCourseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", selectedCourseId);
      if (error) throw error;
      
      return data.map((question): QuizQuestion => ({
        ...question,
        options: Array.isArray(question.options) 
          ? question.options.map(String)
          : [],
      }));
    },
    enabled: !!selectedCourseId,
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
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
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Carregando questões...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <div
          key={question.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border"
        >
          <div>
            <h4 className="font-medium">{question.question}</h4>
            <div className="mt-2 space-y-1">
              {question.options.map((option: string, index: number) => (
                <p
                  key={index}
                  className={`text-sm ${
                    option === question.correct_answer
                      ? "text-green-500 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {option}
                </p>
              ))}
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteQuestionMutation.mutate(question.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}