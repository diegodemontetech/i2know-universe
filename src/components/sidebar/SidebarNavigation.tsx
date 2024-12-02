import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Users, 
  Settings, 
  GraduationCap, 
  Book, 
  Newspaper,
  UserPlus,
  Building,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavigationItem {
  name: string;
  icon: any;
  path: string;
}

interface SidebarNavigationProps {
  isCollapsed: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
}

export const SidebarNavigation = ({ isCollapsed, isAdmin, isAdminMaster }: SidebarNavigationProps) => {
  const location = useLocation();

  const baseNavigation: NavigationItem[] = [
    { name: "Início", icon: Home, path: "/" },
    { name: "Cursos", icon: GraduationCap, path: "/cursos" },
    { name: "E-books", icon: Book, path: "/ebooks" },
    { name: "Notícias", icon: Newspaper, path: "/noticias" },
    { name: "Jornada", icon: Trophy, path: "/jornada" },
  ];

  const adminNavigation: NavigationItem[] = [
    { name: "Usuários", icon: Users, path: "/usuarios" },
    { name: "Configurações", icon: Settings, path: "/configuracoes" },
  ];

  const adminMasterNavigation: NavigationItem[] = [
    { name: "Gerenciar Empresas", icon: Building, path: "/empresas" },
    { name: "Gerenciar Admins", icon: UserPlus, path: "/usuarios/admins" },
  ];

  const navigation = [
    ...baseNavigation,
    ...(isAdmin ? adminNavigation : []),
    ...(isAdminMaster ? adminMasterNavigation : []),
  ];

  return (
    <ScrollArea className="flex-1 px-3">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "nav-link group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              location.pathname === item.path ? "bg-white/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/10",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="truncate">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
};