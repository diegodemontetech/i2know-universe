import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/courses/CourseCard";
import { CategorySection } from "@/components/courses/CategorySection";
import { NewsCard } from "@/components/news/NewsCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Index() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: featuredCourse } = useQuery({
    queryKey: ["featured-course"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: featuredNews = [] } = useQuery({
    queryKey: ["featured-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .in("featured_position", ["home", "both"])
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredCategories = selectedCategories.length > 0
    ? categories.filter(cat => selectedCategories.includes(cat.name))
    : categories;

  return (
    <div className="space-y-12 animate-fade-in">
      {featuredCourse && (
        <div className="relative h-[60vh] w-full rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
          <img
            src={featuredCourse.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
            alt={featuredCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-8 space-y-4">
            <div className="space-y-2">
              <span className="px-2 py-1 bg-primary/90 text-white text-sm rounded-md">
                Em Destaque
              </span>
              <h1 className="text-4xl font-bold">{featuredCourse.title}</h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {featuredCourse.description}
              </p>
            </div>
            <Link 
              to={`/cursos/${featuredCourse.id}`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Categorias</h2>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setSelectedCategories([])}
              className="text-sm text-gray-400 hover:text-white"
            >
              Limpar filtros
            </Button>
          )}
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => toggleCategory(category.name)}
                variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                className="rounded-full px-4 py-1 transition-all"
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="space-y-16">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category.name}
            title={category.name}
          />
        ))}
      </div>

      {featuredNews.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Notícias em Destaque</h2>
            <Link to="/noticias" className="text-primary hover:text-primary/80 transition-colors">
              Ver todas <ArrowRight className="inline-block w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredNews.map((news) => (
              <NewsCard
                key={news.id}
                title={news.title}
                summary={news.summary}
                category={news.category}
                date={news.date}
                image="https://source.unsplash.com/random/?news"
                author={{
                  name: "Autor",
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${news.id}`,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
