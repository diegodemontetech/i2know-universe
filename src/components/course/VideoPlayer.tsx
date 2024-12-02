import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Define the YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  youtubeUrl?: string | null;
  onComplete: () => void;
  isLastLesson: boolean;
}

export function VideoPlayer({ youtubeUrl, onComplete, isLastLesson }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (!youtubeUrl) return;

      const videoId = new URL(youtubeUrl).searchParams.get("v");
      if (!videoId) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: { data: number }) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            
            if (event.data === window.YT.PlayerState.PLAYING) {
              startProgressTracking();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              stopProgressTracking();
            }
          },
        },
      });
    };

    return () => {
      playerRef.current?.destroy();
    };
  }, [youtubeUrl]);

  const startProgressTracking = () => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const newProgress = Math.round((currentTime / duration) * 100);
        setProgress(newProgress);

        if (newProgress >= 90) {
          setCanComplete(true);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopProgressTracking = () => {
    // Progress tracking is handled by the interval in startProgressTracking
  };

  if (!youtubeUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        Nenhum vídeo disponível
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div id="youtube-player" className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-4 space-y-2">
        <Progress value={progress} className="bg-gray-700 [&>[role=progressbar]]:bg-green-500" />
        {canComplete && (
          <Button
            onClick={onComplete}
            className="w-full"
          >
            {isLastLesson ? "Concluir Curso" : "Próxima Aula"}
          </Button>
        )}
      </div>
    </div>
  );
}