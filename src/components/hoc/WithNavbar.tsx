import Navbar from "../navbar/Navbar";
import MobileNavbar from "../navbar/MobileNavbar";

const WithNavbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative">
      <div className="md:block hidden fixed top-6 w-xl left-1/2 -translate-x-1/2 z-40">
        <Navbar />
      </div>
      <main className="pb-20 md:pb-0 md:pt-20">{children}</main>
      <footer className="md:hidden block fixed bottom-0 w-full">
        <MobileNavbar />
      </footer>
    </main>
  );
};

export default WithNavbar;
