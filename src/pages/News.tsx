import { Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const News = () => {
  const news = [
    {
      id: 1,
      title: "Nova Atualização da Plataforma",
      summary: "Confira as novidades e melhorias implementadas na última atualização",
      date: "2024-03-10",
      category: "Plataforma",
      readTime: "5 min",
    },
    // Add more news here
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notícias</h1>
      </div>

      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>
                    {new Date(item.date).toLocaleDateString('pt-BR')} • {item.readTime} de leitura
                  </CardDescription>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {item.category}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;