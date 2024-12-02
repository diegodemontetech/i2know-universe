import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CourseSettings() {
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
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar cursos..."
          className="max-w-sm"
        />
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            <div className="space-y-1">
              <h4 className="font-medium">{course.title}</h4>
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}