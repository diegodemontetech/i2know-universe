import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Clock, BarChart } from "lucide-react";

export default function Courses() {
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      console.log("Fetching courses...");
      const { data, error } = await supabase
        .from("courses")
        .select("*");
      
      console.log("Courses data:", data);
      console.log("Courses error:", error);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-card rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg aspect-video animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading courses:", error);
    return <div>Error loading courses</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Cursos</h1>
      {courses.length === 0 ? (
        <p>Nenhum curso disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link 
              to={`/cursos/${course.id}`}
              key={course.id} 
              className="group bg-card hover:bg-card-hover rounded-lg overflow-hidden transition-all duration-300"
            >
              <div className="aspect-video relative">
                <img
                  src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    <span>{course.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}