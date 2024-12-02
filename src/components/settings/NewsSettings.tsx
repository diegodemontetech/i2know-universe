import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type News = {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  read_time: string;
  featured_position: string | null;
};

type NewsFormData = Omit<News, 'id'>;

const initialFormData: NewsFormData = {
  title: "",
  summary: "",
  category: "",
  date: new Date().toISOString().split("T")[0],
  read_time: "",
  featured_position: null,
};

export function NewsSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: newsList = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (news: NewsFormData[]) => {
      const { data, error } = await supabase
        .from("news")
        .insert(news.map(item => ({
          title: item.title || "",
          summary: item.summary || "",
          category: item.category || "",
          date: item.date,
          read_time: item.read_time || "",
          featured_position: item.featured_position
        })))
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ 
        title: "Notícia criada com sucesso!",
        variant: "default"  // Changed from "success" to "default"
      });
      setIsOpen(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast({ 
        title: "Erro ao criar notícia", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate([formData]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(initialFormData)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Notícia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Resumo</Label>
                <Input
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="read_time">Tempo de Leitura</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  Criar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {newsList.map((news) => (
          <div key={news.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="space-y-1">
              <h4 className="font-medium">{news.title}</h4>
              <p className="text-sm text-muted-foreground">{news.summary}</p>
            </div>
            <div className="space-x-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja excluir esta notícia?")) {
                    // deleteMutation.mutate(news.id); // Assuming delete mutation is implemented
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
