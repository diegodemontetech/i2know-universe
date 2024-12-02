import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSettings } from "@/components/settings/UserSettings";
import { CourseSettings } from "@/components/settings/CourseSettings";
import { CategorySettings } from "@/components/settings/CategorySettings";
import { EbookSettings } from "@/components/settings/EbookSettings";
import { NewsSettings } from "@/components/settings/NewsSettings";
import { CertificateSettings } from "@/components/settings/CertificateSettings";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="ebooks">E-books</TabsTrigger>
          <TabsTrigger value="news">Notícias</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <UserSettings />
        </TabsContent>
        <TabsContent value="courses" className="space-y-4">
          <CourseSettings />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CategorySettings />
        </TabsContent>
        <TabsContent value="ebooks" className="space-y-4">
          <EbookSettings />
        </TabsContent>
        <TabsContent value="news" className="space-y-4">
          <NewsSettings />
        </TabsContent>
        <TabsContent value="certificates" className="space-y-4">
          <CertificateSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;