import Navbar from "../navbar/Navbar";
import MobileNavbar from "../navbar/MobileNavbar";

const WithNavbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative bg-white dark:bg-background">
      <div className="md:block hidden fixed top-6 w-xl left-1/2 -translate-x-1/2 z-40">
        <Navbar />
      </div>
      <main className="bg-white dark:bg-background min-h-screen dark:bg-gradient-to-b dark:from-page-gradient-start dark:via-page-gradient-middle dark:to-page-gradient-end text-text-body-main transition-colors duration-500 py-4">
        <main className="pb-20 md:pb-0 md:pt-20 bg-white dark:bg-background">{children}</main>
      </main>
      <footer className="md:hidden block fixed bottom-0 w-full">
        <MobileNavbar />
      </footer>
    </main>
  );
};

export default WithNavbar;
