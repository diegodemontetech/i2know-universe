import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFiltersProps {
  onCategoriesChange: (categories: string[]) => void;
}

export function CategoryFilters({ onCategoriesChange }: CategoryFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const toggleCategory = (categoryName: string) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(cat => cat !== categoryName)
      : [...selectedCategories, categoryName];
    
    setSelectedCategories(newCategories);
    onCategoriesChange(newCategories);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Categorias</h2>
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedCategories([]);
              onCategoriesChange([]);
            }}
            className="text-sm text-gray-400 hover:text-white"
          >
            Limpar filtros
          </Button>
        )}
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => toggleCategory(category.name)}
              variant={selectedCategories.includes(category.name) ? "default" : "outline"}
              className="rounded-full px-4 py-1 transition-all"
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}