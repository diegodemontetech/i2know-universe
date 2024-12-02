import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryFilters } from "@/components/common/CategoryFilters";
import { useState } from "react";

export default function Courses() {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", session?.user?.id],
    queryFn: async () => {
      console.log("Fetching courses...");
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session?.user?.id)
        .single();

      if (profile?.role === "admin_master") {
        const { data, error } = await supabase
          .from("courses")
          .select("*");
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          course_permissions!inner (
            user_id
          )
        `)
        .eq("course_permissions.user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filteredCourses = selectedCategories.length > 0
    ? courses.filter(course => selectedCategories.includes(course.category))
    : courses;

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cursos</h1>
      
      <div className="mb-8">
        <CategoryFilters onCategoriesChange={setSelectedCategories} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="group bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="relative">
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigate(`/cursos/${course.id}`)}
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                {course.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {course.duration} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}