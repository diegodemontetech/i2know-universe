import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  date: string;
  author?: {
    name: string;
    avatar?: string;
  };
  image?: string;
}

export function NewsCard({ title, summary, category, date, author, image }: NewsCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || "https://source.unsplash.com/random/?news"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-primary">{category}</span>
          <button className="text-gray-400 hover:text-primary transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {summary}
        </p>

        <div className="flex items-center justify-between">
          {author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-400">{author.name}</span>
            </div>
          )}
          <time className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(date), { 
              addSuffix: true,
              locale: ptBR 
            })}
          </time>
        </div>
      </div>
    </Card>
  );
}