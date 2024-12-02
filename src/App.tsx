import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthLayout } from "./components/AuthLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import CompanySettings from "./pages/CompanySettings";
import Users from "./pages/Users";
import AdminUsers from "./pages/Users/AdminUsers";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Ebooks from "./pages/Ebooks";
import News from "./pages/News";
import Journey from "./pages/Journey";
import { useSession, SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Index />} />
              <Route path="empresas" element={<Companies />} />
              <Route path="empresas/:id/configuracoes" element={<CompanySettings />} />
              <Route path="usuarios" element={<Users />} />
              <Route path="usuarios/admins" element={<AdminUsers />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="cursos" element={<Courses />} />
              <Route path="cursos/:id" element={<CourseDetails />} />
              <Route path="ebooks" element={<Ebooks />} />
              <Route path="noticias" element={<News />} />
              <Route path="jornada" element={<Journey />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;