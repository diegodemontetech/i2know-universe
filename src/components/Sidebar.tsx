import { Home, Building2, Users, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  { name: "Perfil", icon: User, path: "/perfil" },
  { name: "Configurações", icon: Settings, path: "/configuracoes" },
];

export const Sidebar = () => {
  const location = useLocation();
  const { data: profile } = useProfile();
  const isAdminMaster = profile?.role === "admin_master";

  return (
    <aside className="w-64 bg-sidebar min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">i2Know</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          if (item.adminOnly && !isAdminMaster) return null;
          
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
              <span className={isActive ? "text-white" : "text-gray-400"}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};