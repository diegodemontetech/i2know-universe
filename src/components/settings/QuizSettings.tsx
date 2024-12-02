import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function QuizSettings() {
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select>
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Questão
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          Selecione um curso para gerenciar seu quiz
        </p>
      </div>
    </div>
  );
}