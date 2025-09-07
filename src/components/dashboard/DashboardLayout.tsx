import type { ReactNode } from "react";
import Navbar from "../navbar/Navbar";
import MobileNavbar from "../navbar/MobileNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] flex flex-col">
      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-24">{children}</main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/10">
        <div className="hidden md:block">
          <div className="pb-4">
            <Navbar />
          </div>
        </div>
        <div className="block md:hidden">
          <MobileNavbar />
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
