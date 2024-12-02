import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const questionFormSchema = z.object({
  question: z.string()
    .min(10, "A pergunta deve ter pelo menos 10 caracteres")
    .max(500, "A pergunta não pode ter mais de 500 caracteres"),
  options: z.array(z.string()
    .min(1, "A opção não pode estar vazia")
    .max(200, "A opção não pode ter mais de 200 caracteres"))
    .min(2, "Adicione pelo menos 2 opções")
    .max(5, "Máximo de 5 opções permitidas"),
  correctAnswer: z.string().min(1, "Selecione a resposta correta"),
});

interface QuestionEditProps {
  questionId: string;
  initialData: {
    question: string;
    options: string[];
    correct_answer: string;
  };
  onSuccess: () => void;
}

export function QuestionEdit({ questionId, initialData, onSuccess }: QuestionEditProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question: initialData.question,
      options: initialData.options,
      correctAnswer: initialData.correct_answer,
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof questionFormSchema>) => {
      console.log("Updating question:", values);
      const { data, error } = await supabase
        .from("quiz_questions")
        .update({
          question: values.question,
          options: values.options,
          correct_answer: values.correctAnswer,
        })
        .eq("id", questionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({
        title: "Questão atualizada",
        description: "A questão foi atualizada com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating question:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a questão.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof questionFormSchema>) => {
    updateQuestionMutation.mutate(values);
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
          <FormLabel>Opções</FormLabel>
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

        <Button 
          type="submit" 
          className="w-full"
          disabled={updateQuestionMutation.isPending}
        >
          {updateQuestionMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            "Atualizar Questão"
          )}
        </Button>
      </form>
    </Form>
  );
}