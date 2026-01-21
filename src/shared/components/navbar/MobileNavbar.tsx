import { NAV_ITEMS } from "@/constants";
// import { IoQrCodeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import useCheckOngoingEvent from "@/hooks/useCheckOngoingEvent";
import logo from "@/assets/TCCD_logo.svg";
import { TbLogout2 } from "react-icons/tb";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

const MobileNavbar = () => {
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <nav className="w-full bg-surface-glass-bg relative flex justify-between items-center px-[6%] h-16 border border-surface-glass-border/20 rounded-t-3xl">
      <LogoutModal
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
      />
      {NAV_ITEMS.map(({ icon: Icon, to, title }, index) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            className={`${
              active ? "text-primary" : "text-secondary"
            } inline-flex flex-col items-center gap-1 ${
              index === 1 ? "mr-7" : index === 2 ? "ml-7" : ""
            } cursor-pointer`}
            key={title}
            to={to}
          >
            <Icon size={22} />
            <span
              className={`${
                active ? "text-primary" : "text-text-muted-foreground"
              } text-xs`}
            >
              {title}
            </span>
          </Link>
        );
      })}
      <div
        className="inline-flex flex-col items-center gap-1 cursor-pointer group"
        onClick={() => setShowLogoutModal(true)}
      >
        <TbLogout2
          size={22}
          className="text-secondary group-hover:text-primary transition-colors duration-200"
        />
        <span className="text-xs text-text-muted-foreground">Logout</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -top-7">
        <div className="relative">
          {/* soft pedestal shadow */}
          <div
            aria-hidden
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-14 rounded-full bg-black/10 blur-md"
          />
          {/* badge */}
          <div className="rounded-full p-1.5 bg-surface-glass-bg border border-surface-glass-border/20 shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
            <div className="rounded-full p-1 bg-gradient-to-b from-surface-glass-bg to-muted-primary/5">
              <img
                src={logo}
                alt="TCCD"
                className="block h-10 w-10" /* slightly smaller */
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
