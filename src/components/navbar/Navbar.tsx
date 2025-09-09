import { NAV_ITEMS } from "@/constants";
import { NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/TCCD_logo.svg";

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <header className="w-full flex justify-center px-3 py-3">
      <nav
        className="
          relative w-full max-w-xl
          rounded-full border border-black/10
          bg-white/80
          backdrop-blur supports-[backdrop-filter]:backdrop-blur-md
          shadow-[0_6px_22px_rgba(0,0,0,0.05)]
          px-1.5 py-1 flex items-center gap-16
        "
      >
        {/* Tabs */}
        {NAV_ITEMS.map(({ to, title }) => {
          const active =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <NavLink
              key={title}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`
                group flex-1 text-center rounded-full px-2.5 py-1.5
                text-sm font-semibold
                transition-all duration-150
                outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/35
                ${
                  active
                    ? "bg-active-tab-bg text-active-tab-text shadow-inner"
                    : "text-inactive-tab-text hover:bg-zinc-100/80 hover:text-primary"
                }
              `}
            >
              <span className="inline-block">{title}</span>
            </NavLink>
          );
        })}

        {/* Center logo — refined floating style */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-7">
          <div className="relative">
            {/* soft pedestal shadow */}
            <div
              aria-hidden
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-14 rounded-full bg-black/10 blur-md"
            />
            {/* badge */}
            <div className="rounded-full p-1.5 bg-white border border-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
              <div className="rounded-full p-1 bg-gradient-to-b from-white to-[#f7f7f7]">
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
    </header>
  );
};

export default Navbar;
