import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Trophy, Share2, Linkedin, Instagram, Facebook } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { LevelCard } from "@/components/journey/LevelCard";

const socialNetworks = [
  { name: "LinkedIn", icon: Linkedin, color: "hover:bg-[#0077b5]", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
  { name: "Instagram", icon: Instagram, color: "hover:bg-[#E4405F]", url: "https://www.instagram.com/share?url=" },
  { name: "Facebook", icon: Facebook, color: "hover:bg-[#1877F2]", url: "https://www.facebook.com/sharer/sharer.php?u=" },
];

export default function Journey() {
  const session = useSession();
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: levels = [] } = useQuery({
    queryKey: ["levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("levels")
        .select("*")
        .order("min_points");

      if (error) throw error;
      return data;
    },
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ["user-certificates", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_progress")
        .select(`
          *,
          courses (
            title,
            thumbnail_url,
            category
          )
        `)
        .eq("user_id", session?.user?.id)
        .eq("progress", 100);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const currentPoints = profile?.points || 0;
  const currentLevel = levels.find(level => 
    currentPoints >= level.min_points && 
    (!level.max_points || currentPoints <= level.max_points)
  );

  const handleShare = (network: typeof socialNetworks[0], certificateId: string) => {
    const shareUrl = `${window.location.origin}/certificates/${certificateId}`;
    window.open(`${network.url}${shareUrl}`, "_blank");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Sua Jornada de Aprendizado</h1>
        <p className="text-white/80">
          Continue aprendendo para alcançar novos níveis
        </p>
      </div>

      {/* Current Level Card */}
      <Card className="border-none bg-gradient-to-br from-card via-card/50 to-card/30">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 rounded-full bg-card inline-block mb-2">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">Nível {currentLevel?.name}</CardTitle>
          <CardDescription className="text-white/80">
            {currentPoints.toLocaleString()} pontos conquistados
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Level Progress Path */}
      <div className="relative py-12">
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-secondary/20 -translate-y-1/2">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min((currentPoints / (levels[levels.length - 1]?.max_points || 10000)) * 100, 100)}%`,
              boxShadow: '0 0 20px rgba(229, 9, 20, 0.5)'
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
          {levels.map((level, index) => (
            <div key={level.id} className="relative">
              {index > 0 && (
                <div 
                  className="absolute top-1/2 -left-8 w-16 h-16 border-t-2 border-primary/30"
                  style={{
                    transform: `rotate(${index % 2 ? 15 : -15}deg)`,
                    transformOrigin: index % 2 ? 'bottom left' : 'top left'
                  }}
                />
              )}
              <LevelCard
                name={level.name}
                icon={level.icon}
                minPoints={level.min_points}
                maxPoints={level.max_points}
                currentPoints={currentPoints}
                isCurrentLevel={currentLevel?.id === level.id}
                isUnlocked={currentPoints >= level.min_points}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Certificates Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Certificados Conquistados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificates?.map((certificate) => (
            <Card 
              key={certificate.id}
              className="group relative overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <img
                    src={certificate.courses?.thumbnail_url || "/placeholder.svg"}
                    alt={certificate.courses?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <TooltipProvider>
                      {socialNetworks.map((network) => (
                        <Tooltip key={network.name}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleShare(network, certificate.id)}
                              className={`p-2 rounded-full bg-white/10 ${network.color} transition-colors`}
                            >
                              <network.icon className="w-4 h-4 text-white" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-white">Compartilhar no {network.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate">{certificate.courses?.title}</h3>
                  <p className="text-sm text-white/60">{certificate.courses?.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}