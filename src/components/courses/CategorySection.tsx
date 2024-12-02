import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "./CourseCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategorySectionProps {
  category: string;
  title: string;
}

export const CategorySection = ({ category, title }: CategorySectionProps) => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses-by-category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {courses.map((course) => (
            <div key={course.id} className="w-[300px] flex-none">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};