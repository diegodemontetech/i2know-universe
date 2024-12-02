import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Filter, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const questionFormSchema = z.object({
  question: z.string().min(2, "A pergunta deve ter pelo menos 2 caracteres"),
  options: z.array(z.string()).min(2, "Adicione pelo menos 2 opções"),
  correctAnswer: z.string().min(1, "Selecione a resposta correta"),
});

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export function QuizSettings() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      options: ["", "", "", ""],
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", selectedCategoryId],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*");
      
      if (selectedCategoryId) {
        query = query.eq("category_id", selectedCategoryId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", selectedCourseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", selectedCourseId);
      if (error) throw error;
      
      // Ensure options is always an array
      return data.map((question): QuizQuestion => ({
        ...question,
        options: Array.isArray(question.options) ? question.options : [],
      }));
    },
    enabled: !!selectedCourseId,
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof questionFormSchema>) => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .insert([
          {
            quiz_id: selectedCourseId,
            question: values.question,
            options: values.options,
            correct_answer: values.correctAnswer,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({
        title: "Questão criada",
        description: "A questão foi criada com sucesso.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating question:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a questão.",
        variant: "destructive",
      });
    },
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

  const onSubmit = (values: z.infer<typeof questionFormSchema>) => {
    createQuestionMutation.mutate(values);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-[200px]">
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
              Nova Questão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Questão</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pergunta</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Opções</Label>
                  {form.getValues().options.map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`options.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder={`Opção ${index + 1}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resposta Correta</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a resposta correta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.getValues().options.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option || `Opção ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Criar Questão
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!selectedCourseId ? (
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Selecione um curso para gerenciar suas questões
          </p>
        </div>
      ) : isLoadingQuestions ? (
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Carregando questões...
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}