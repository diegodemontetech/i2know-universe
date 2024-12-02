import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface News {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  read_time: string;
}

const NewsCard = ({ news }: { news: News }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start mb-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {news.category}
        </Badge>
        <span className="text-sm text-gray-500">{news.read_time}</span>
      </div>
      <CardTitle className="line-clamp-2">{news.title}</CardTitle>
      <CardDescription>
        {new Date(news.date).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 line-clamp-3">{news.summary}</p>
    </CardContent>
  </Card>
);

const News = () => {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      console.log("Fetching news...");
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
        
      if (error) {
        console.error("Error fetching news:", error);
        throw error;
      }
      console.log("News fetched:", data);
      return data as News[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-semibold">Nenhuma notícia disponível</h2>
        <p className="text-muted-foreground">
          Novas notícias serão adicionadas em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notícias e Atualizações</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
};

export default News;