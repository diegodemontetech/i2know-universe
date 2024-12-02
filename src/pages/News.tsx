import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function News() {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      console.log("Fetching news...");
      const { data, error } = await supabase
        .from("news")
        .select("*");
      
      console.log("News data:", data);
      console.log("News error:", error);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error loading news:", error);
    return <div>Error loading news</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Notícias</h1>
      {news.length === 0 ? (
        <p>Nenhuma notícia disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.id} className="bg-card rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}