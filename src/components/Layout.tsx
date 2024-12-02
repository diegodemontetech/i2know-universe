import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8 transition-all duration-300 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};