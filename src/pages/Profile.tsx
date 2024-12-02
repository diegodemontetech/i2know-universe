import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";

const Profile = () => {
  const session = useSession();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq("id", session?.user?.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">Foto de Perfil</Label>
            <Input id="avatar" type="file" accept="image/*" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nome</Label>
              <Input id="first_name" defaultValue={profile?.first_name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Sobrenome</Label>
              <Input id="last_name" defaultValue={profile?.last_name} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={session?.user?.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" defaultValue={profile?.companies?.name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Input
              id="role"
              defaultValue={
                profile?.role === "admin_master"
                  ? "Admin Master"
                  : profile?.role === "admin"
                  ? "Admin"
                  : "Usuário"
              }
              disabled
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
};

export default Profile;