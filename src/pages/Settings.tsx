import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSettings } from "@/components/settings/UserSettings";
import { CategorySettings } from "@/components/settings/CategorySettings";
import { CourseSettings } from "@/components/settings/CourseSettings";
import { LessonSettings } from "@/components/settings/LessonSettings";
import { QuizSettings } from "@/components/settings/QuizSettings";
import { NewsSettings } from "@/components/settings/NewsSettings";
import { EbookSettings } from "@/components/settings/EbookSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("usuarios");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie usuários, categorias, cursos e conteúdo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
          <TabsTrigger value="aulas">Aulas</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="noticias">Notícias</TabsTrigger>
          <TabsTrigger value="destaques">Destaques</TabsTrigger>
          <TabsTrigger value="ebooks">E-books</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>
                Adicione, edite ou remova usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>
                Gerencie as categorias disponíveis para cursos e conteúdo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategorySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursos">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Cursos</CardTitle>
              <CardDescription>
                Adicione, edite ou remova cursos da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseSettings />
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
              <LessonSettings />
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
              <QuizSettings />
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
              <NewsSettings />
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
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Cursos em Destaque</h3>
                  <div className="space-y-2">
                    {/* Highlighted courses will be implemented later */}
                  </div>
                </div>
              </div>
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
              <EbookSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
