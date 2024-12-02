import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string;
  companies?: {
    name: string;
  } | null;
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          companies (*)
        `);

      if (error) throw error;
      return data as User[];
    },
  });

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getInitials = (user: User) => {
    return `${(user.first_name?.[0] || "").toUpperCase()}${(user.last_name?.[0] || "").toUpperCase()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 space-y-6">
        <h1 className="text-3xl font-bold">Users</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-card"
            >
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-1/4 bg-gray-700 rounded" />
                <div className="h-3 w-1/3 bg-gray-700 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-card-hover transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>{getInitials(user)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {user.first_name} {user.last_name}
                  </h3>
                  <Badge variant="secondary" className="capitalize">
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
                {user.companies && (
                  <p className="text-sm text-gray-400">{user.companies.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}