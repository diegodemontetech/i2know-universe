import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function UserSettings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.admin.createUser({
        email,
        password,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Create user error:", error);
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate({ email, password });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Criar Novo Usuário</h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={handleCreateUser}>Criar Usuário</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Usuários Existentes</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="py-2">
              {user.email}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Ações</h2>
        <Button variant="destructive" onClick={() => toast({ title: "Ação executada", description: "Ação foi bem-sucedida." })}>
          Exemplo de Ação
        </Button>
      </div>
    </div>
  );
}
