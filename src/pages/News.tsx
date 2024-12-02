import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "@/components/news/NewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, TrendingUp, BookOpen } from "lucide-react";

export default function News() {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      
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
    return (
      <div className="text-center text-red-500">
        Erro ao carregar as notícias
      </div>
    );
  }

  // Separar notícias em diferentes categorias
  const featuredNews = news.slice(0, 1)[0]; // Primeira notícia para destaque
  const topNews = news.slice(1, 4); // Próximas 3 para top notícias
  const recentNews = news.slice(4, 7); // Próximas 3 para notícias recentes
  const remainingNews = news.slice(7); // Resto das notícias

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      {featuredNews && (
        <div className="relative h-[500px] rounded-2xl overflow-hidden group">
          <img
            src="https://source.unsplash.com/random/?news"
            alt={featuredNews.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm mb-4">
              {featuredNews.category}
            </span>
            <h1 className="text-4xl font-bold text-white mb-4">{featuredNews.title}</h1>
            <p className="text-gray-200 text-lg mb-4 line-clamp-2">{featuredNews.summary}</p>
            <div className="flex items-center gap-4 text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{featuredNews.read_time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full justify-start border-b mb-8">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recentes
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Mais Lidas
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-8">
          {/* Top News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topNews.map((item) => (
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

          {/* Recent News List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentNews.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 bg-card rounded-lg hover:bg-card-hover transition-colors">
                <img
                  src="https://source.unsplash.com/random/?news"
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <span className="text-sm text-primary">{item.category}</span>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 line-clamp-2">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {remainingNews.map((item) => (
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
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 6).map((item) => (
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
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from(new Set(news.map(item => item.category))).map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-primary pb-2">{category}</h3>
                <div className="space-y-4">
                  {news
                    .filter(item => item.category === category)
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <img
                          src="https://source.unsplash.com/random/?news"
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium line-clamp-2">{item.title}</h4>
                          <span className="text-sm text-gray-400">{item.read_time}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}