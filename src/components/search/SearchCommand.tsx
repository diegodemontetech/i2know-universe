import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Book, GraduationCap, PlayCircle } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "course" | "ebook" | "lesson";
  parentId?: string; // For lessons, this is the course_id
}

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const session = useSession();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: searchResults = [] } = useQuery<SearchResult[]>({
    queryKey: ["search", search, session?.user?.id],
    queryFn: async () => {
      if (!search || !session?.user?.id) return [];
      console.log("Searching for:", search);

      const results: SearchResult[] = [];

      // Search courses user has access to
      const { data: courses } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          course_permissions!inner (user_id)
        `)
        .eq("course_permissions.user_id", session.user.id)
        .ilike("title", `%${search}%`)
        .limit(5);

      if (courses) {
        results.push(
          ...courses.map((course) => ({
            id: course.id,
            title: course.title,
            type: "course" as const,
          }))
        );

        // Search lessons within accessible courses
        const courseIds = courses.map((c) => c.id);
        if (courseIds.length > 0) {
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id, title, course_id")
            .in("course_id", courseIds)
            .ilike("title", `%${search}%`)
            .limit(5);

          if (lessons) {
            results.push(
              ...lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                type: "lesson" as const,
                parentId: lesson.course_id,
              }))
            );
          }
        }
      }

      // Search ebooks
      const { data: ebooks } = await supabase
        .from("ebooks")
        .select("id, title")
        .ilike("title", `%${search}%`)
        .limit(5);

      if (ebooks) {
        results.push(
          ...ebooks.map((ebook) => ({
            id: ebook.id,
            title: ebook.title,
            type: "ebook" as const,
          }))
        );
      }

      console.log("Search results:", results);
      return results;
    },
    enabled: !!search && !!session?.user?.id,
  });

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    switch (result.type) {
      case "course":
        navigate(`/cursos/${result.id}`);
        break;
      case "ebook":
        navigate(`/ebooks/${result.id}`);
        break;
      case "lesson":
        navigate(`/cursos/${result.parentId}`, { state: { lessonId: result.id } });
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full max-w-sm relative text-sm text-muted-foreground rounded-md border border-input px-3 py-2 text-left"
      >
        <span className="inline-flex items-center gap-2">
          <span>Buscar...</span>
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar cursos, aulas e ebooks..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {searchResults.length > 0 && (
            <>
              <CommandGroup heading="Cursos">
                {searchResults
                  .filter((r) => r.type === "course")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Aulas">
                {searchResults
                  .filter((r) => r.type === "lesson")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="E-books">
                {searchResults
                  .filter((r) => r.type === "ebook")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <Book className="mr-2 h-4 w-4" />
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}