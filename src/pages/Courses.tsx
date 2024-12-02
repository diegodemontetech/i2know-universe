import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error loading courses:", error);
    return <div>Error loading courses</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cursos</h1>
      {courses.length === 0 ? (
        <p>Nenhum curso disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-card rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}