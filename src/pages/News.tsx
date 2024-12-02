import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "@/components/news/NewsCard";

export default function News() {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      console.log("Fetching news...");
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      
      console.log("News data:", data);
      console.log("News error:", error);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading news:", error);
    return (
      <div className="text-center text-red-500">
        Erro ao carregar as notícias
      </div>
    );
  }

  // Agrupar notícias em destaque (3 primeiras) e o resto
  const featuredNews = news.slice(0, 3);
  const regularNews = news.slice(3);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Últimas Notícias</h1>
      
      {/* Featured News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredNews.map((item) => (
          <NewsCard
            key={item.id}
            title={item.title}
            summary={item.summary}
            category={item.category}
            date={item.date}
            image="https://source.unsplash.com/random/?news"
            author={{
              name: "Autor",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`,
            }}
          />
        ))}
      </div>

      {/* Regular News Grid */}
      {regularNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {regularNews.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              date={item.date}
              image="https://source.unsplash.com/random/?news"
              author={{
                name: "Autor",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}