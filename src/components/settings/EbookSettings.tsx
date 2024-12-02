import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function EbookSettings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar e-books..."
          className="max-w-sm"
        />
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo E-book
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ebook-title">Título</Label>
            <Input id="ebook-title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input id="author" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Resumo</Label>
            <Textarea id="summary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Número de Páginas</Label>
              <Input id="pages" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reading_time">Tempo de Leitura</Label>
              <Input id="reading_time" placeholder="Ex: 2 horas" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Capa</Label>
            <div className="flex items-center gap-4">
              <Input id="cover" type="file" accept="image/*" />
              <Button type="button" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          <Button type="submit">Publicar E-book</Button>
        </form>
      </div>
    </div>
  );
}