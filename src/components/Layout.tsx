import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 transition-all duration-300 animate-fade-in ml-20 lg:ml-64">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}