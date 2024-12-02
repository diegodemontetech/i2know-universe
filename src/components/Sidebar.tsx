import { useState } from "react";
import { 
  Home, 
  Building2, 
  Users, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Book, 
  Newspaper,
  UserPlus,
  Building,
  LogOut
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "./ui/use-toast";

const useProfile = () => {
  const session = useSession();
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile for user:", session?.user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
        
      console.log("Profile data:", data);
      console.log("Profile error:", error);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });
};

// Base navigation items for all users
const baseNavigation = [
  { name: "Início", icon: Home, path: "/" },
  { name: "Cursos", icon: GraduationCap, path: "/cursos" },
  { name: "E-books", icon: Book, path: "/ebooks" },
  { name: "Notícias", icon: Newspaper, path: "/noticias" },
];

// Admin-only navigation items
const adminNavigation = [
  { name: "Usuários", icon: Users, path: "/usuarios" },
  { name: "Configurações", icon: Settings, path: "/configuracoes" },
];

// Admin master only navigation items
const adminMasterNavigation = [
  { name: "Gerenciar Empresas", icon: Building, path: "/empresas" },
  { name: "Gerenciar Admins", icon: UserPlus, path: "/usuarios/admins" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabaseClient = useSupabaseClient();
  const session = useSession();
  const { data: profile, isLoading } = useProfile();
  const [isCollapsed, setIsCollapsed] = useState(true);

  console.log("Current user role:", profile?.role);

  const isAdmin = profile?.role === "admin" || profile?.role === "admin_master";
  const isAdminMaster = profile?.role === "admin_master";

  // Combine navigation items based on user role
  const navigation = [
    ...baseNavigation,
    ...(isAdmin ? adminNavigation : []),
    ...(isAdminMaster ? adminMasterNavigation : []),
  ];

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair. Tente novamente.",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar min-h-screen flex flex-col fixed left-0 top-0 bottom-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-white/10 bg-sidebar text-gray-400 hover:text-white shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? 
          <ChevronRight className="h-3 w-3" /> : 
          <ChevronLeft className="h-3 w-3" />
        }
      </Button>

      <div className="p-4 flex justify-center items-center">
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "w-10" : "w-28"
        )}>
          <img
            src={isCollapsed ? "https://i.ibb.co/qW3jGcW/i2know-1.png" : "https://i.ibb.co/yRKDrV7/i2know.png"}
            alt="i2Know"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "nav-link group",
                location.pathname === item.path ? "active" : "",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5",
                location.pathname === item.path ? "text-white" : "text-gray-400"
              )} />
              {!isCollapsed && (
                <span className={location.pathname === item.path ? "text-white" : "text-gray-400"}>
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4 border-t border-white/10">
        <Link
          to="/perfil"
          className={cn(
            "flex items-center gap-3 px-2 py-3 rounded-lg transition-colors hover:bg-white/10",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-primary">
              {profile?.first_name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {profile?.first_name || session?.user?.email}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {profile?.role || 'user'}
              </span>
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          className={cn(
            "w-full mt-2 text-gray-400 hover:text-white hover:bg-white/10",
            isCollapsed && "px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </aside>
  );
};