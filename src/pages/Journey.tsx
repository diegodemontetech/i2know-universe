import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, Trophy, Share2, Linkedin, Instagram, Facebook, WhatsApp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

const LEVELS = [
  { name: "Aprendiz", certificates: 0, icon: "🌱" },
  { name: "Explorador", certificates: 5, icon: "🚀" },
  { name: "Especialista", certificates: 10, icon: "⭐" },
  { name: "Mestre", certificates: 25, icon: "🎓" },
  { name: "Sábio", certificates: 50, icon: "🏆" },
  { name: "Gênio", certificates: 75, icon: "👑" },
  { name: "Lendário", certificates: 100, icon: "🌟" },
];

const Journey = () => {
  const session = useSession();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["user-certificates", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_progress")
        .select("*, courses(*)")
        .eq("user_id", session?.user?.id)
        .eq("progress", 100);

      if (error) throw error;
      return data;
    },
  });

  const certificateCount = certificates?.length || 0;
  const currentLevel = LEVELS.reduce((prev, curr) => 
    certificateCount >= curr.certificates ? curr : prev
  );
  const nextLevel = LEVELS.find(level => level.certificates > certificateCount);
  
  const progressToNextLevel = nextLevel 
    ? ((certificateCount - currentLevel.certificates) / (nextLevel.certificates - currentLevel.certificates)) * 100
    : 100;

  const handleShare = (platform: string, certificateId: string) => {
    const url = `${window.location.origin}/certificates/${certificateId}`;
    const text = "Acabei de conquistar mais um certificado! 🎉";
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      instagram: `https://instagram.com/share?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse">Carregando sua jornada...</div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Sua Jornada de Aprendizado</h1>
        <p className="text-muted-foreground">
          Continue aprendendo e desbloqueie novos níveis!
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{currentLevel.icon}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Nível: {currentLevel.name}
              <Trophy className="h-5 w-5 text-yellow-500" />I'll create a new Journey page to showcase the user's learning path with gamification elements and social sharing features.

<lov-code>
First, let's create the new Journey page:

<lov-write file_path="src/pages/Journey.tsx">
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Trophy, Share2, Linkedin, Instagram, Facebook, WhatsApp } from "lucide-react";
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

const levels = [
  { name: "Aprendiz", threshold: 0, color: "bg-zinc-400" },
  { name: "Explorador", threshold: 5, color: "bg-blue-400" },
  { name: "Especialista", threshold: 10, color: "bg-green-400" },
  { name: "Mestre", threshold: 25, color: "bg-purple-400" },
  { name: "Sábio", threshold: 50, color: "bg-yellow-400" },
  { name: "Gênio", threshold: 75, color: "bg-red-400" },
  { name: "Lendário", threshold: 100, color: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" },
];

const socialNetworks = [
  { name: "LinkedIn", icon: Linkedin, color: "hover:bg-[#0077b5]", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
  { name: "Instagram", icon: Instagram, color: "hover:bg-[#E4405F]", url: "https://www.instagram.com/share?url=" },
  { name: "Facebook", icon: Facebook, color: "hover:bg-[#1877F2]", url: "https://www.facebook.com/sharer/sharer.php?u=" },
  { name: "WhatsApp", icon: WhatsApp, color: "hover:bg-[#25D366]", url: "https://wa.me/?text=" },
];

export default function Journey() {
  const session = useSession();
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["user-certificates", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_progress")
        .select(`
          *,
          courses:course_id (
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
  });

  const totalCertificates = certificates?.length || 0;
  const currentLevel = levels.reduce((acc, level) => 
    totalCertificates >= level.threshold ? level : acc
  );
  
  const nextLevel = levels.find(level => level.threshold > totalCertificates);
  const progress = nextLevel 
    ? ((totalCertificates - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
    : 100;

  const handleShare = (network: typeof socialNetworks[0], certificateId: string) => {
    const shareUrl = `${window.location.origin}/certificates/${certificateId}`;
    const shareText = encodeURIComponent("Confira minha conquista!");
    window.open(`${network.url}${shareUrl}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xl">Carregando sua jornada...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Sua Jornada de Aprendizado</h1>
        <p className="text-muted-foreground">
          Continue aprendendo para alcançar novos níveis
        </p>
      </div>

      <Card className="border-none bg-gradient-to-br from-card via-card/50 to-card/30">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 rounded-full bg-card inline-block mb-2">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Nível {currentLevel.name}</CardTitle>
          <CardDescription>
            {totalCertificates} certificado{totalCertificates !== 1 ? 's' : ''} conquistado{totalCertificates !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          {nextLevel && (
            <p className="text-center text-sm text-muted-foreground">
              Faltam {nextLevel.threshold - totalCertificates} certificados para o nível {nextLevel.name}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {certificates?.map((certificate) => (
          <Card 
            key={certificate.id}
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <img
                  src={certificate.courses.thumbnail_url || "/placeholder.svg"}
                  alt={certificate.courses.title}
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
                          <p>Compartilhar no {network.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{certificate.courses.title}</h3>
                <p className="text-sm text-muted-foreground">{certificate.courses.category}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}