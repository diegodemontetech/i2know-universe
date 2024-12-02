import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  summary: z.string().min(1, "O resumo é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  read_time: z.string().min(1, "O tempo de leitura é obrigatório"),
  featured_position: z.string().min(1, "A posição de destaque é obrigatória"),
});

export function NewsSettings() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      category: "",
      read_time: "",
      featured_position: "none",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("news").insert([
        {
          ...values,
          date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Notícia criada com sucesso!",
        variant: "success",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating news:", error);
      toast({
        title: "Erro ao criar notícia",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da notícia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite o resumo da notícia"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Digite a categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="read_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo de Leitura</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 5 min" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posição de Destaque</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição de destaque" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sem destaque</SelectItem>
                  <SelectItem value="home">Página inicial</SelectItem>
                  <SelectItem value="news_top">Topo da página de notícias</SelectItem>
                  <SelectItem value="both">Ambos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Criar Notícia</Button>
      </form>
    </Form>
  );
}