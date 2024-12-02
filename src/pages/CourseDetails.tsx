import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Play, Clock, BarChart } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      console.log("Fetching course details for id:", id);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching course:", error);
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-[40vh] bg-card rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-card rounded w-1/3" />
          <div className="h-4 bg-card rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!course) {
    return <div>Curso não encontrado</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative h-[40vh] rounded-xl overflow-hidden">
        <img
          src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span>{course.difficulty}</span>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Play className="w-4 h-4 mr-2" /> Começar Agora
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Sobre o curso</h2>
          <p className="text-gray-400">{course.description}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Conteúdo do curso</h2>
          <div className="bg-card rounded-lg p-4">
            <p className="text-gray-400">Conteúdo em breve...</p>
          </div>
        </div>
      </div>
    </div>
  );
}