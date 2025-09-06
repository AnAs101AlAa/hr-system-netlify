import Navbar from "../navbar/Navbar";
import MobileNavbar from "../navbar/MobileNavbar";

const WithNavbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative">
      <div className="md:block hidden">
        <Navbar />
      </div>
      <main>{children}</main>
      <footer className="md:hidden block fixed bottom-0 w-full">
        <MobileNavbar />
      </footer>
    </main>
  );
};

export default WithNavbar;
