import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("usuarios");

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
        
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie usuários, categorias, cursos e conteúdo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
          <TabsTrigger value="aulas">Aulas</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="noticias">Notícias</TabsTrigger>
          <TabsTrigger value="destaques">Destaques</TabsTrigger>
          <TabsTrigger value="ebooks">E-books</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>
                Adicione, edite ou remova usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User management content will go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>
                Gerencie as categorias disponíveis para cursos e conteúdo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="category-name">Nome da Categoria</Label>
                    <Input id="category-name" placeholder="Nova categoria" />
                  </div>
                  <Button className="mt-6">Adicionar</Button>
                </div>
                
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 bg-card rounded-lg">
                      <span>{category.name}</span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Excluir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar structure for other tabs */}
        <TabsContent value="cursos">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Cursos</CardTitle>
              <CardDescription>
                Adicione, edite ou remova cursos da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Course management content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aulas">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Aulas</CardTitle>
              <CardDescription>
                Gerencie o conteúdo das aulas de cada curso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Lesson management content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Quiz</CardTitle>
              <CardDescription>
                Configure questões e respostas para os quizzes dos cursos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Quiz management content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="noticias">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Notícias</CardTitle>
              <CardDescription>
                Publique e gerencie notícias da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* News management content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destaques">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Destaques</CardTitle>
              <CardDescription>
                Configure os cursos e conteúdos em destaque.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Featured content management */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ebooks">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar E-books</CardTitle>
              <CardDescription>
                Adicione e gerencie e-books disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ebook management content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;