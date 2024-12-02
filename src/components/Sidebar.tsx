import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarProfile } from "./sidebar/SidebarProfile";

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

export const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabaseClient = useSupabaseClient();
  const session = useSession();
  const { data: profile, isLoading } = useProfile();
  const [isCollapsed, setIsCollapsed] = useState(true);

  console.log("Current user role:", profile?.role);

  const isAdmin = profile?.role === "admin" || profile?.role === "admin_master";
  const isAdminMaster = profile?.role === "admin_master";

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
      
      <SidebarNavigation 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
        isAdminMaster={isAdminMaster}
      />

      <SidebarProfile 
        profile={profile}
        isCollapsed={isCollapsed}
        handleLogout={handleLogout}
      />
    </aside>
  );
};