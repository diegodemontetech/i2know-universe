import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface LessonFormProps {
  courseId: string;
  onSuccess: () => void;
}

export function LessonForm({ courseId, onSuccess }: LessonFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      try {
        // First create the lesson
        const { data: lesson, error: lessonError } = await supabase
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

        if (lessonError) throw lessonError;

        // If there's a file, upload it and create a support material
        if (file) {
          const fileExt = file.name.split(".").pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("support-materials")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("support-materials")
            .getPublicUrl(filePath);

          const { error: materialError } = await supabase
            .from("support_materials")
            .insert([
              {
                lesson_id: lesson.id,
                title: file.name,
                description: `Material de apoio para ${title}`,
                file_url: publicUrl,
              },
            ]);

          if (materialError) throw materialError;
        }

        return lesson;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({ title: "Aula criada com sucesso!" });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating lesson:", error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile.name);
      setFile(selectedFile);
    }
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
      <div className="space-y-2">
        <Label htmlFor="file">Material de Apoio</Label>
        <div className="flex items-center gap-4">
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
          />
          <Button type="button" variant="outline" onClick={() => document.getElementById("file")?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
        {file && (
          <p className="text-sm text-muted-foreground">
            Arquivo selecionado: {file.name}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? "Criando Aula..." : "Criar Aula"}
      </Button>
    </form>
  );
}