import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FinalQuizProps {
  courseId: string;
  onComplete: () => void;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  created_at: string;
}

export function FinalQuiz({ courseId, onComplete }: FinalQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["final-quiz-questions", courseId],
    queryFn: async () => {
      console.log("Fetching quiz questions for course:", courseId);
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("id")
        .eq("course_id", courseId)
        .single();

      if (quizError) throw quizError;

      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quiz.id)
        .order("created_at");

      if (error) throw error;
      return data as QuizQuestion[];
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: { quizId: string; questionId: string; answer: string }) => {
      const { data, error } = await supabase
        .from("quiz_responses")
        .insert([
          {
            quiz_id: answer.quizId,
            question_id: answer.questionId,
            answer: answer.answer,
            is_correct: answer.answer === questions[currentQuestion].correct_answer,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        onComplete();
        toast({
          title: "Quiz concluído!",
          description: "Parabéns por completar o curso!",
        });
      }
    },
    onError: (error) => {
      console.error("Error submitting answer:", error);
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um erro ao enviar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Final</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nenhuma questão disponível para este quiz.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Questão {currentQuestion + 1} de {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{currentQuestionData.question}</p>
        <RadioGroup
          value={answers[currentQuestionData.id]}
          onValueChange={(value) => {
            setAnswers(prev => ({
              ...prev,
              [currentQuestionData.id]: value
            }));
          }}
          className="space-y-2"
        >
          {currentQuestionData.options.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!answers[currentQuestionData.id] || submitAnswerMutation.isPending}
          onClick={() => {
            submitAnswerMutation.mutate({
              quizId: currentQuestionData.quiz_id,
              questionId: currentQuestionData.id,
              answer: answers[currentQuestionData.id],
            });
          }}
        >
          {submitAnswerMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : currentQuestion === questions.length - 1 ? (
            "Finalizar Quiz"
          ) : (
            "Próxima Questão"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}