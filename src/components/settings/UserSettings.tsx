import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  avatar_url?: string | null;
  company_id?: string | null;
};

type ProfileFormData = {
  first_name: string;
  last_name: string;
  role: string;
};

const initialFormData: ProfileFormData = {
  first_name: "",
  last_name: "",
  role: "",
};

export function UserSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProfile: ProfileFormData) => {
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ ...newProfile, id: crypto.randomUUID() }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({ title: "Usuário criado com sucesso!" });
      setIsOpen(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast({ 
        title: "Erro ao criar usuário", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (profile: Profile) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          role: profile.role,
        })
        .eq("id", profile.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({ title: "Usuário atualizado com sucesso!" });
      setIsOpen(false);
      setEditingProfile(null);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast({ 
        title: "Erro ao atualizar usuário", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({ title: "Usuário excluído com sucesso!" });
    },
    onError: (error) => {
      toast({ 
        title: "Erro ao excluir usuário", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfile) {
      updateMutation.mutate({ ...editingProfile, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      role: profile.role,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProfile(null);
              setFormData(initialFormData);
            }}>
              <Pencil className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProfile ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            <div className="space-y-1">
              <h4 className="font-medium">{profile.first_name} {profile.last_name}</h4>
              <p className="text-sm text-muted-foreground">
                Função: {profile.role}
              </p>
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(profile)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(profile.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}