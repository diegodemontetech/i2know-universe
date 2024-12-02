import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonFormProps {
  courseId: string;
  onSuccess: () => void;
}

export function LessonForm({ courseId, onSuccess }: LessonFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .insert([
          {
            course_id: courseId,
            title,
            description,
            youtube_url: youtubeUrl,
            order_index: orderIndex,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Aula criada com sucesso!" });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar aula",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
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
      <div className="space-y-2">
        <Label htmlFor="youtube">Link do YouTube</Label>
        <Input
          id="youtube"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Ordem</Label>
        <Input
          id="order"
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value))}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Criar Aula
      </Button>
    </form>
  );
}