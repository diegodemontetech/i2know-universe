import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryFilters } from "@/components/common/CategoryFilters";
import { useState } from "react";

export default function Ebooks() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: ebooks = [], isLoading, error } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      console.log("Fetching ebooks...");
      const { data, error } = await supabase
        .from("ebooks")
        .select("*");
      
      console.log("Ebooks data:", data);
      console.log("Ebooks error:", error);
      
      if (error) throw error;
      return data;
    },
  });

  const filteredEbooks = selectedCategories.length > 0
    ? ebooks.filter(ebook => ebook.categories.some(cat => selectedCategories.includes(cat)))
    : ebooks;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error loading ebooks:", error);
    return <div>Error loading ebooks</div>;
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
              {ebook.cover && (
                <img
                  src={ebook.cover}
                  alt={ebook.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{ebook.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">por {ebook.author}</p>
                <p className="text-muted-foreground mt-2 line-clamp-2">{ebook.summary}</p>
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
    </div>
  );
}