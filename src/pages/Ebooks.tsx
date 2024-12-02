import { Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Ebook {
  id: string;
  title: string;
  author: string;
  cover: string;
  summary: string;
  pages: number;
  reading_time: string;
  published_at: string;
  categories: string[];
}

const Ebooks = () => {
  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("published_at", { ascending: false });
        
      if (error) throw error;
      return data as Ebook[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-books</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img
                src={ebook.cover}
                alt={ebook.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <CardTitle>{ebook.title}</CardTitle>
              <CardDescription>por {ebook.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{ebook.summary}</p>
              <div className="flex flex-wrap gap-2">
                {ebook.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between w-full text-sm text-gray-500">
                <span>{ebook.pages} páginas</span>
                <span>{ebook.reading_time} de leitura</span>
              </div>
              <Button className="w-full">
                <Book className="w-4 h-4 mr-2" />
                Ler Agora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Ebooks;