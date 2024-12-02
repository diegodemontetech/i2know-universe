import { useEffect, useState } from "react";
import { Trophy, Star } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  name: string;
  icon: string;
  minPoints: number;
  maxPoints: number | null;
  currentPoints: number;
  isCurrentLevel: boolean;
  isUnlocked: boolean;
}

export function LevelCard({
  name,
  icon,
  minPoints,
  maxPoints,
  currentPoints,
  isCurrentLevel,
  isUnlocked,
}: LevelCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isUnlocked && maxPoints) {
      const pointsInLevel = currentPoints - minPoints;
      const levelRange = maxPoints - minPoints;
      setProgress((pointsInLevel / levelRange) * 100);
    }
  }, [currentPoints, minPoints, maxPoints, isUnlocked]);

  return (
    <div
      className={cn(
        "relative p-6 rounded-xl transition-all duration-300",
        isCurrentLevel
          ? "bg-gradient-to-br from-card via-card/50 to-card/30 shadow-lg shadow-primary/20"
          : "bg-card hover:bg-card-hover",
        isUnlocked ? "opacity-100" : "opacity-50"
      )}
    >
      {isCurrentLevel && (
        <div className="absolute -top-3 -right-3">
          <div className="p-2 bg-primary rounded-full animate-pulse">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <CircularProgress value={isUnlocked ? progress : 0} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className={cn(
              "w-8 h-8 transition-all duration-300",
              isUnlocked ? "text-primary" : "text-gray-600"
            )} />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/60">
            {minPoints.toLocaleString()} - {maxPoints?.toLocaleString() ?? "∞"} pts
          </p>
        </div>

        {isCurrentLevel && (
          <div className="w-full bg-secondary/30 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}