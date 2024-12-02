import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  difficulty: string;
  duration: number;
}

const FeaturedCourse = ({ course }: { course: Course }) => (
  <div className="relative h-[70vh] w-full rounded-xl overflow-hidden mb-12">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
    <img
      src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
      alt={course.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 left-0 p-8 space-y-4">
      <div className="space-y-2">
        <span className="px-2 py-1 bg-primary/90 text-white text-sm rounded-md">
          Em Destaque
        </span>
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          {course.description}
        </p>
      </div>
      <div className="flex gap-4">
        <Button className="bg-primary hover:bg-primary/90">
          <Play className="w-4 h-4 mr-2" /> Começar Agora
        </Button>
        <Button variant="outline">
          Saiba Mais <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </div>
);

const CourseCard = ({ course }: { course: Course }) => (
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
      </div>
    </div>
  </div>
);

const Index = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      console.log("Fetching courses...");
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
      console.log("Courses fetched:", data);
      return data as Course[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-[70vh] w-full rounded-xl bg-card animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video rounded-lg bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-semibold">Nenhum curso disponível</h2>
        <p className="text-muted-foreground">
          Novos cursos serão adicionados em breve.
        </p>
      </div>
    );
  }

  const featuredCourse = courses[0];
  const otherCourses = courses.slice(1, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {featuredCourse && <FeaturedCourse course={featuredCourse} />}
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">Continue Aprendendo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherCourses.map((course) => (
            <Link to={`/cursos/${course.id}`} key={course.id}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;