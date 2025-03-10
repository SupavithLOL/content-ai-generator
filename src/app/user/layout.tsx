"use client";

import { useState } from "react";
import Header from "./_components/Header";
import UserSidebar from "./_components/Sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="grid min-h-screen h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <UserSidebar />
      <div className="flex flex-col">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex flex-1 flex-col gap-4 p-6 lg:gap-6 bg-[#f5f5f5]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
