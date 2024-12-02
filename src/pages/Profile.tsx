import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const session = useSession();

  const { data: profile, isLoading } = useQuery({
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

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Nome</label>
            <p className="text-lg">{profile?.first_name} {profile?.last_name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-400">Email</label>
            <p className="text-lg">{session?.user?.email}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-400">Função</label>
            <p className="text-lg capitalize">{profile?.role}</p>
          </div>

          {profile?.company_id && (
            <div>
              <label className="text-sm font-medium text-gray-400">Empresa</label>
              <p className="text-lg">{profile?.companies?.name}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;