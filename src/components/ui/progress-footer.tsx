import { Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressMetrics {
  hoursRemaining?: number;
  totalPages?: number;
  currentPage?: number;
  totalLessons?: number;
  completedLessons?: number;
  progressPercentage: number;
}

interface ProgressFooterProps {
  metrics: ProgressMetrics;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  className?: string;
}

export function ProgressFooter({
  metrics,
  isVisible,
  onToggleVisibility,
  className,
}: ProgressFooterProps) {
  return (
    <div className={cn("mt-auto pt-4 space-y-3", className)}>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex gap-4">
          {metrics.hoursRemaining !== undefined && (
            <span>{metrics.hoursRemaining}h remaining</span>
          )}
          {metrics.totalPages !== undefined && (
            <span>
              {metrics.currentPage || 0}/{metrics.totalPages} pages
            </span>
          )}
          {metrics.totalLessons !== undefined && (
            <span>
              {metrics.completedLessons || 0}/{metrics.totalLessons} lessons
            </span>
          )}
        </div>
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-[#39FF14]" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
      <Progress 
        value={metrics.progressPercentage} 
        className="h-1 bg-neutral-700"
      >
        <div
          className="h-full bg-[#39FF14] transition-all duration-300"
          style={{ width: `${metrics.progressPercentage}%` }}
        />
      </Progress>
    </div>
  );
}