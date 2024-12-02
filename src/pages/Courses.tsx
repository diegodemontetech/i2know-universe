import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export default function Courses() {
  const session = useSession();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", session?.user?.id],
    queryFn: async () => {
      // Get all courses if user is admin
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

      // Get only permitted courses for regular users
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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cursos</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
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