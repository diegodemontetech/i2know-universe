import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChange } from "@/components/profile/PasswordChange";
import { CurrentLevel } from "@/components/profile/CurrentLevel";

const Profile = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, companies(*)")
        .eq("id", session?.user?.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch current level data
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

  const currentLevel = levels.find(level => 
    (profile?.points || 0) >= level.min_points && 
    (!level.max_points || (profile?.points || 0) <= level.max_points)
  );

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", session?.user?.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleProfileUpdate = async (data: any) => {
    await updateProfile.mutateAsync(data);
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    await updateProfile.mutateAsync({ avatar_url: avatarUrl });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ProfileAvatar
                userId={session?.user?.id || ''}
                currentAvatarUrl={profile?.avatar_url}
                userInitial={(profile?.first_name?.[0] || session?.user?.email?.[0] || '').toUpperCase()}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
            
            <ProfileForm
              initialData={profile || {}}
              onSubmit={handleProfileUpdate}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {currentLevel && (
            <Card>
              <CardHeader>
                <CardTitle>Nível Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <CurrentLevel
                  level={currentLevel}
                  currentPoints={profile?.points || 0}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordChange />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;