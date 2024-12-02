import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryFilters } from "@/components/common/CategoryFilters";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { BookReader } from "@/components/ebooks/BookReader";
import { ReadingProgress } from "@/components/ebooks/ReadingProgress";
import { useToast } from "@/hooks/use-toast";

export default function Ebooks() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEbook, setSelectedEbook] = useState<any>(null);
  const session = useSession();
  const { toast } = useToast();

  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      console.log("Fetching ebooks...");
      const { data, error } = await supabase
        .from("ebooks")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: readingProgress = {}, refetch: refetchProgress } = useQuery({
    queryKey: ["reading-progress", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return {};
      
      const { data, error } = await supabase
        .from("reading_progress")
        .select("ebook_id, current_page")
        .eq("user_id", session.user.id);
      
      if (error) throw error;
      
      return data.reduce((acc: any, item) => {
        acc[item.ebook_id] = item.current_page;
        return acc;
      }, {});
    },
    enabled: !!session?.user?.id,
  });

  const updateReadingProgress = async (ebookId: string, currentPage: number) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from("reading_progress")
      .upsert({
        user_id: session.user.id,
        ebook_id: ebookId,
        current_page: currentPage,
      });

    if (error) {
      console.error("Error updating reading progress:", error);
      toast({
        title: "Erro ao salvar progresso",
        description: "Não foi possível salvar seu progresso de leitura.",
        variant: "destructive",
      });
      return;
    }

    refetchProgress();
  };

  const filteredEbooks = selectedCategories.length > 0
    ? ebooks.filter(ebook => ebook.categories.some((cat: string) => selectedCategories.includes(cat)))
    : ebooks;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">E-books</h1>

      <div className="mb-8">
        <CategoryFilters onCategoriesChange={setSelectedCategories} />
      </div>

      {filteredEbooks.length === 0 ? (
        <p>Nenhum e-book disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEbooks.map((ebook) => (
            <div key={ebook.id} className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                {ebook.cover && (
                  <img
                    src={ebook.cover}
                    alt={ebook.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedEbook(ebook)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{ebook.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">por {ebook.author}</p>
                <p className="text-muted-foreground mt-2 line-clamp-2">{ebook.summary}</p>
                <div className="mt-4">
                  <ReadingProgress
                    currentPage={readingProgress[ebook.id] || 0}
                    totalPages={ebook.pages}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {ebook.reading_time}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {ebook.pages} páginas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEbook && (
        <BookReader
          open={!!selectedEbook}
          onOpenChange={(open) => !open && setSelectedEbook(null)}
          ebook={selectedEbook}
          currentPage={readingProgress[selectedEbook.id] || 0}
          onPageChange={(page) => updateReadingProgress(selectedEbook.id, page)}
        />
      )}
    </div>
  );
}