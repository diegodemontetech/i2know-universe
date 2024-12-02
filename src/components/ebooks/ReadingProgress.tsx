import { Progress } from "@/components/ui/progress";

interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
}

export function ReadingProgress({ currentPage, totalPages }: ReadingProgressProps) {
  const progress = (currentPage / totalPages) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <div className="text-sm text-muted-foreground text-center">
        {currentPage}/{totalPages} páginas
      </div>
    </div>
  );
}