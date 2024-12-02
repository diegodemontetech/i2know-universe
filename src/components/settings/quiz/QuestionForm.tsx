import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const questionFormSchema = z.object({
  question: z.string().min(2, "A pergunta deve ter pelo menos 2 caracteres"),
  options: z.array(z.string()).min(2, "Adicione pelo menos 2 opções"),
  correctAnswer: z.string().min(1, "Selecione a resposta correta"),
});

interface QuestionFormProps {
  quizId: string;
  onSuccess: () => void;
}

export function QuestionForm({ quizId, onSuccess }: QuestionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      options: ["", "", "", ""],
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof questionFormSchema>) => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .insert([
          {
            quiz_id: quizId,
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
      onSuccess();
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

  const onSubmit = (values: z.infer<typeof questionFormSchema>) => {
    createQuestionMutation.mutate(values);
  };

  return (
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
  );
}