import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function UserSettings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, password, selectedCourses }: { 
      email: string; 
      password: string; 
      selectedCourses: string[];
    }) => {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (authError) throw authError;

      // Create course permissions
      const coursePermissionsPromises = selectedCourses.map(courseId => 
        supabase
          .from("course_permissions")
          .insert({ user_id: authData.user.id, course_id: courseId })
      );

      await Promise.all(coursePermissionsPromises);
    },
    onSuccess: () => {
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
      setEmail("");
      setPassword("");
      setSelectedCourses([]);
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
    createUserMutation.mutate({ email, password, selectedCourses });
  };

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(current =>
      current.includes(courseId)
        ? current.filter(id => id !== courseId)
        : [...current, courseId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar Novo Usuário</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Permissões de Cursos</Label>
            <div className="grid gap-2">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`course-${course.id}`}
                    checked={selectedCourses.includes(course.id)}
                    onCheckedChange={() => handleCourseToggle(course.id)}
                  />
                  <Label htmlFor={`course-${course.id}`}>{course.title}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreateUser}>Criar Usuário</Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Usuários Existentes</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="py-2 px-4 bg-card rounded-lg">
              {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}