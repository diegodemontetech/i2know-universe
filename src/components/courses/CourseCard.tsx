import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string | null;
    category: string;
    difficulty: string;
    duration: number;
  };
  showProgress?: boolean;
}

export const CourseCard = ({ course, showProgress = true }: CourseCardProps) => {
  const session = useSession();

  const { data: progress } = useQuery({
    queryKey: ["course-progress", course.id, session?.user?.id],
    queryFn: async () => {
      console.log("Fetching progress for course:", course.id, "user:", session?.user?.id);
      
      const { data, error } = await supabase
        .from("course_progress")
        .select("progress")
        .eq("course_id", course.id)
        .eq("user_id", session?.user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching progress:", error);
        throw error;
      }
      
      console.log("Progress data:", data);
      return data;
    },
    enabled: !!session?.user?.id && showProgress,
  });

  return (
    <div className="group relative overflow-hidden rounded-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="mt-2 text-sm text-gray-300 line-clamp-2">
            {course.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm bg-white/20 px-2 py-1 rounded">
              {course.difficulty}
            </span>
            <span className="text-sm">
              {Math.floor(course.duration / 60)}h {course.duration % 60}m
            </span>
          </div>
          {showProgress && progress && (
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-1" />
            </div>
          )}
          <Link to={`/cursos/${course.id}`}>
            <Button variant="secondary" size="sm" className="mt-3">
              <Eye className="w-4 h-4 mr-2" />
              Ver Curso
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};