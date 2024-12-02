import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 transition-all duration-300 ml-[4.5rem] lg:ml-64 bg-background">
          <div className="min-h-screen p-2 sm:p-4">
            <div className="container mx-auto max-w-[1920px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      {!isMobile && <Footer />}
    </div>
  );
}