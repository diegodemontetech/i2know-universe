import { Home, BookOpen, Newspaper, Trophy, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Courses", icon: BookOpen, path: "/courses" },
  { name: "News", icon: Newspaper, path: "/news" },
  { name: "Journey", icon: Trophy, path: "/journey" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">i2Know</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
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