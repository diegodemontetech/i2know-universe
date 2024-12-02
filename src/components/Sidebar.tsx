import { useState } from "react";
import { Home, Building2, Users, User, Settings, ChevronLeft, ChevronRight, GraduationCap, Book, Newspaper } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const useProfile = () => {
  const session = useSession();
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });
};

const navigation = [
  { name: "Início", icon: Home, path: "/" },
  { name: "Empresas", icon: Building2, path: "/empresas", adminOnly: true },
  { name: "Usuários", icon: Users, path: "/usuarios" },
  { name: "Cursos", icon: GraduationCap, path: "/cursos" },
  { name: "E-books", icon: Book, path: "/ebooks" },
  { name: "Notícias", icon: Newspaper, path: "/noticias" },
  { name: "Perfil", icon: User, path: "/perfil" },
  { name: "Configurações", icon: Settings, path: "/configuracoes" },
];

export const Sidebar = () => {
  const location = useLocation();
  const { data: profile } = useProfile();
  const isAdminMaster = profile?.role === "admin_master";
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside 
      className={cn(
        "bg-sidebar min-h-screen flex flex-col relative transition-all duration-300",
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
      
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          if (item.adminOnly && !isAdminMaster) return null;
          
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "nav-link group",
                isActive ? "active" : "",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-white" : "text-gray-400"
              )} />
              {!isCollapsed && (
                <span className={isActive ? "text-white" : "text-gray-400"}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};