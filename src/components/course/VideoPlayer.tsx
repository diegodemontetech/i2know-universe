import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  youtubeUrl: string | null;
  onComplete: () => void;
}

export function VideoPlayer({ youtubeUrl, onComplete }: VideoPlayerProps) {
  if (!youtubeUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Selecione uma aula para começar
      </div>
    );
  }

  const videoId = youtubeUrl.split("v=")[1];

  return (
    <div className="relative h-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <Button
        className="absolute bottom-4 right-4"
        onClick={onComplete}
      >
        Concluir Aula
      </Button>
    </div>
  );
}