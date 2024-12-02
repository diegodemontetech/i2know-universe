import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompanySettings = () => {
  const { id } = useParams();
  
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input id="name" defaultValue={company?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio</Label>
              <Input id="domain" defaultValue={company?.domain} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" type="file" accept="image/*" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Cor Primária</Label>
                <Input
                  id="primary_color"
                  type="color"
                  defaultValue={company?.primary_color}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Cor Secundária</Label>
                <Input
                  id="secondary_color"
                  type="color"
                  defaultValue={company?.secondary_color}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="background_color">Cor de Fundo</Label>
                <Input
                  id="background_color"
                  type="color"
                  defaultValue={company?.background_color}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar_color">Cor da Barra Lateral</Label>
                <Input
                  id="sidebar_color"
                  type="color"
                  defaultValue={company?.sidebar_color}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Salvar Alterações</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;