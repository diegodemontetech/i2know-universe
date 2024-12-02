import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuestionFiltersProps {
  selectedCategoryId: string;
  selectedCourseId: string;
  onCategoryChange: (value: string) => void;
  onCourseChange: (value: string) => void;
}

export function QuestionFilters({
  selectedCategoryId,
  selectedCourseId,
  onCategoryChange,
  onCourseChange,
}: QuestionFiltersProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", selectedCategoryId],
    queryFn: async () => {
      let query = supabase.from("courses").select("*");
      
      if (selectedCategoryId) {
        query = query.eq("category_id", selectedCategoryId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex gap-4">
      <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas as categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCourseId} onValueChange={onCourseChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione o curso" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}