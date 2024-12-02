import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = React.useState(1);

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
      <div className="space-y-2">
        {paginatedQuestions.map((question) => (
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir questão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteQuestionMutation.mutate(question.id)}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}