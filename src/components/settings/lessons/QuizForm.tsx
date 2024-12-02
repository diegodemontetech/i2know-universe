import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";

interface QuizFormProps {
  courseId: string;
  onSuccess: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export function QuizForm({ courseId, onSuccess }: QuizFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert([
          {
            title,
            description,
          },
        ])
        .select()
        .single();

      if (quizError) throw quizError;

      // Create questions
      const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(
          questions.map((q) => ({
            quiz_id: quiz.id,
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
          }))
        );

      if (questionsError) throw questionsError;

      return quiz;
    },
    onSuccess: () => {
      toast({ title: "Quiz criado com sucesso!" });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | string[]) => {
    setQuestions(
      questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Quiz</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Questões</Label>
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Questão
          </Button>
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <Label>Pergunta {qIndex + 1}</Label>
                <Input
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, "question", e.target.value)
                  }
                  required
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(qIndex)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Opções</Label>
              {question.options.map((option, oIndex) => (
                <Input
                  key={oIndex}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...question.options];
                    newOptions[oIndex] = e.target.value;
                    updateQuestion(qIndex, "options", newOptions);
                  }}
                  placeholder={`Opção ${oIndex + 1}`}
                  required
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label>Resposta Correta</Label>
              <Input
                value={question.correctAnswer}
                onChange={(e) =>
                  updateQuestion(qIndex, "correctAnswer", e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Criar Quiz
      </Button>
    </form>
  );
}