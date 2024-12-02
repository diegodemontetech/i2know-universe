import React from "react";
import { Sidebar } from "./Sidebar";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8 transition-all duration-300 animate-fade-in">
        {children}
      </main>
    </div>
  );
};