import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Ebooks() {
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
      {ebooks.length === 0 ? (
        <p>Nenhum e-book disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <div key={ebook.id} className="bg-card rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold">{ebook.title}</h2>
              <p className="text-muted-foreground mt-2">{ebook.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}