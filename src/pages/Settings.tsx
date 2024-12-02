import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const session = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Email: {session?.user?.email}
            </p>
            <Button variant="destructive" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;