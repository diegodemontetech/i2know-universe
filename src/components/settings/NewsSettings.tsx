import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function NewsSettings() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar notícias..."
          className="max-w-sm"
        />
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Resumo</Label>
            <Textarea id="summary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="read_time">Tempo de Leitura</Label>
            <Input id="read_time" placeholder="Ex: 5 min" />
          </div>
          <Button type="submit">Publicar Notícia</Button>
        </form>
      </div>
    </div>
  );
}