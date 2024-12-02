import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProfileProps {
  profile: any;
  isCollapsed: boolean;
  handleLogout: () => void;
}

export const SidebarProfile = ({ profile, isCollapsed, handleLogout }: SidebarProfileProps) => {
  const session = useSession();

  return (
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
  );
};