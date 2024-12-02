import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
}

interface CourseProgress {
  course_id: string;
  progress: number;
}

const CourseCard = ({ course, progress }: { course: Course; progress?: number }) => {
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
            <Badge variant="secondary" className="bg-white/20">
              {course.difficulty}
            </Badge>
            <span className="text-sm">
              {Math.floor(course.duration / 60)}h {course.duration % 60}m
            </span>
          </div>
          {progress !== undefined && (
            <div className="mt-3">
              <Progress value={progress} className="h-1" />
              <span className="mt-1 text-xs text-gray-300">
                {progress}% complete
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const categories = [
  "All",
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Data Science",
];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");

      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: courseProgress = [] } = useQuery({
    queryKey: ["course_progress", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("course_progress")
        .select("course_id, progress")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data as CourseProgress[];
    },
    enabled: !!session?.user?.id,
  });

  const progressMap = Object.fromEntries(
    courseProgress.map(p => [p.course_id, p.progress])
  );

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 space-y-6">
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-card hover:bg-card-hover text-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoadingCourses ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-video animate-pulse rounded-lg bg-card"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              progress={progressMap[course.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}