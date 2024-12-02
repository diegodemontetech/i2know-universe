import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  youtubeUrl: string | null;
  onComplete: () => void;
  isLastLesson?: boolean;
}

export function VideoPlayer({ youtubeUrl, onComplete, isLastLesson }: VideoPlayerProps) {
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  
  useEffect(() => {
    // Reset progress when video changes
    setVideoProgress(0);
    setHasWatchedEnough(false);
  }, [youtubeUrl]);

  if (!youtubeUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Selecione uma aula para começar
      </div>
    );
  }

  const videoId = youtubeUrl.split("v=")[1];

  const onPlayerReady = (event: YT.PlayerEvent) => {
    playerRef.current = event.target;
    
    // Set up progress tracking
    const updateProgress = () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);
        
        // Mark as watched when 90% complete
        if (progress >= 90 && !hasWatchedEnough) {
          setHasWatchedEnough(true);
        }
      }
    };

    // Update progress every second
    setInterval(updateProgress, 1000);
  };

  return (
    <div className="relative h-full bg-black flex flex-col">
      <div className="flex-1">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={(e) => {
            // @ts-ignore - YouTube IFrame API types
            new YT.Player(e.target, {
              events: {
                onReady: onPlayerReady,
              },
            });
          }}
        />
      </div>
      
      <div className="p-4 space-y-4 bg-black/90">
        <Progress value={videoProgress} className="h-2 bg-gray-700">
          <div 
            className="h-full bg-success transition-all" 
            style={{ width: `${videoProgress}%` }}
          />
        </Progress>
        
        {hasWatchedEnough && (
          <Button
            className="w-full bg-success hover:bg-success/90"
            onClick={onComplete}
          >
            {isLastLesson ? "Concluir Curso" : "Próxima Aula"}
          </Button>
        )}
      </div>
    </div>
  );
}