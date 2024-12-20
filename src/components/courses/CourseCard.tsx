import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ProgressFooter } from "@/components/ui/progress-footer";

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
      
      if (!session?.user?.id) {
        console.log("No user session, skipping progress fetch");
        return null;
      }

      const { data, error } = await supabase
        .from("course_progress")
        .select("progress")
        .eq("course_id", course.id)
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No progress found for course");
          return null;
        }
        console.error("Error fetching progress:", error);
        throw error;
      }
      
      console.log("Progress data:", data);
      return data;
    },
    enabled: !!session?.user?.id && showProgress,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["course-lessons", course.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", course.id);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
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
        
        {showProgress && (
          <ProgressFooter
            className="mt-4"
            metrics={{
              hoursRemaining: Math.ceil((course.duration * (100 - (progress?.progress || 0))) / 6000),
              totalLessons: lessons.length,
              completedLessons: Math.floor((lessons.length * (progress?.progress || 0)) / 100),
              progressPercentage: progress?.progress || 0,
            }}
          />
        )}

        <Link to={`/cursos/${course.id}`} className="mt-4">
          <Button variant="secondary" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Ver Curso
          </Button>
        </Link>
      </div>
    </div>
  );
};