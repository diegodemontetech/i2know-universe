import { useState } from "react";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ProfileAvatarProps {
  userId: string;
  currentAvatarUrl?: string | null;
  userInitial: string;
  onAvatarUpdate: (url: string) => void;
}

export function ProfileAvatar({ userId, currentAvatarUrl, userInitial, onAvatarUpdate }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onAvatarUpdate(publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar foto",
        description: "Ocorreu um erro ao tentar atualizar sua foto de perfil.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl || undefined} />
        <AvatarFallback className="bg-primary text-xl">
          {userInitial}
        </AvatarFallback>
      </Avatar>
      
      <label htmlFor="avatar-upload">
        <Button 
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </label>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
}