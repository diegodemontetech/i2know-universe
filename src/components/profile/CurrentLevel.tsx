import { Trophy } from "lucide-react";
import { CircularProgress } from "@/components/journey/CircularProgress";

interface CurrentLevelProps {
  level: {
    name: string;
    icon: string;
    min_points: number;
    max_points: number | null;
  };
  currentPoints: number;
}

export function CurrentLevel({ level, currentPoints }: CurrentLevelProps) {
  const progress = level.max_points
    ? ((currentPoints - level.min_points) / (level.max_points - level.min_points)) * 100
    : 100;

  return (
    <div className="relative p-6 bg-gradient-to-br from-card via-card/50 to-card/30 rounded-xl">
      <div className="absolute -top-3 -right-3">
        <div className="p-2 bg-primary rounded-full">
          <Trophy className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <CircularProgress value={progress} />
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={level.icon} 
              alt={level.name}
              className="w-12 h-12"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">{level.name}</h3>
          <p className="text-sm text-white/60">
            {currentPoints.toLocaleString()} pontos
          </p>
        </div>
      </div>
    </div>
  );
}