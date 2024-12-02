import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function EbookSettings() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    summary: "",
    pages: "",
    reading_time: "",
    cover: null as File | null,
    pdf: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Upload cover image
      let coverUrl = "";
      if (formData.cover) {
        const coverPath = `covers/${Date.now()}-${formData.cover.name}`;
        const { error: coverError } = await supabase.storage
          .from("ebooks")
          .upload(coverPath, formData.cover);

        if (coverError) throw coverError;
        coverUrl = `${supabase.storage.from("ebooks").getPublicUrl(coverPath).data.publicUrl}`;
      }

      // Upload PDF file
      let pdfUrl = "";
      if (formData.pdf) {
        const pdfPath = `pdfs/${Date.now()}-${formData.pdf.name}`;
        const { error: pdfError } = await supabase.storage
          .from("ebooks")
          .upload(pdfPath, formData.pdf);

        if (pdfError) throw pdfError;
        pdfUrl = `${supabase.storage.from("ebooks").getPublicUrl(pdfPath).data.publicUrl}`;
      }

      // Save ebook data
      const { error: dbError } = await supabase.from("ebooks").insert({
        title: formData.title,
        author: formData.author,
        summary: formData.summary,
        pages: parseInt(formData.pages),
        reading_time: formData.reading_time,
        cover: coverUrl,
        pdf_url: pdfUrl,
        categories: [],
        published_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      toast({
        title: "E-book publicado com sucesso!",
        description: "O e-book foi adicionado à biblioteca.",
      });

      // Reset form
      setFormData({
        title: "",
        author: "",
        summary: "",
        pages: "",
        reading_time: "",
        cover: null,
        pdf: null,
      });
    } catch (error) {
      console.error("Error uploading ebook:", error);
      toast({
        title: "Erro ao publicar e-book",
        description: "Ocorreu um erro ao tentar publicar o e-book. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ebook-title">Título</Label>
            <Input 
              id="ebook-title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input 
              id="author"
              value={formData.author}
              onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Resumo</Label>
            <Textarea 
              id="summary"
              value={formData.summary}
              onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Número de Páginas</Label>
              <Input 
                id="pages" 
                type="number"
                value={formData.pages}
                onChange={e => setFormData(prev => ({ ...prev, pages: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reading_time">Tempo de Leitura</Label>
              <Input 
                id="reading_time" 
                placeholder="Ex: 2 horas"
                value={formData.reading_time}
                onChange={e => setFormData(prev => ({ ...prev, reading_time: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Capa</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="cover" 
                type="file" 
                accept="image/*"
                onChange={e => handleFileChange(e, 'cover')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf">PDF do E-book</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="pdf" 
                type="file" 
                accept="application/pdf"
                onChange={e => handleFileChange(e, 'pdf')}
              />
            </div>
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Publicando..." : "Publicar E-book"}
          </Button>
        </form>
      </div>
    </div>
  );
}