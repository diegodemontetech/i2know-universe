import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSettings } from "@/components/settings/UserSettings";
import { CategorySettings } from "@/components/settings/CategorySettings";

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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Buscar cursos..."
                    className="max-w-sm"
                  />
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Curso
                  </Button>
                </div>

                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg border"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.description}
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {course.categories?.name}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Aula
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground text-center">
                    Selecione um curso para gerenciar suas aulas
                  </p>
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Questão
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground text-center">
                    Selecione um curso para gerenciar seu quiz
                  </p>
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Buscar notícias..."
                    className="max-w-sm"
                  />
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Notícia
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Resumo</Label>
                      <Textarea id="summary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="read_time">Tempo de Leitura</Label>
                      <Input id="read_time" placeholder="Ex: 5 min" />
                    </div>
                    <Button type="submit">Publicar Notícia</Button>
                  </form>
                </div>
              </div>
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
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-2 bg-card rounded border"
                      >
                        <span>{course.title}</span>
                        <Button variant="outline" size="sm">
                          Destacar
                        </Button>
                      </div>
                    ))}
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Buscar e-books..."
                    className="max-w-sm"
                  />
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo E-book
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ebook-title">Título</Label>
                      <Input id="ebook-title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor</Label>
                      <Input id="author" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Resumo</Label>
                      <Textarea id="summary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pages">Número de Páginas</Label>
                        <Input id="pages" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reading_time">Tempo de Leitura</Label>
                        <Input id="reading_time" placeholder="Ex: 2 horas" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cover">Capa</Label>
                      <div className="flex items-center gap-4">
                        <Input id="cover" type="file" accept="image/*" />
                        <Button type="button" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                    <Button type="submit">Publicar E-book</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
