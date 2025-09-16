import { NAV_ITEMS } from "@/constants";
import { IoQrCodeOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useCheckOngoingEvent from "@/hooks/useCheckOngoingEvent";

const MobileNavbar = () => {
  const { pathname } = useLocation();
  const checkAndNavigate = useCheckOngoingEvent();

  return (
    <nav className="w-full bg-white relative flex justify-center gap-[65%] items-center px-5 h-16 border border-[#000]/13 rounded-t-3xl">
      {NAV_ITEMS.map(({ icon: Icon, to, title }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            className={`${
              active ? "text-primary" : "text-secondary"
            } inline-flex flex-col items-center gap-1`}
            key={title}
            to={to}
          >
            <Icon size={24} />
            <span
              className={`${
                active ? "text-muted-primary" : "text-muted-secondary"
              } text-xs`}
            >
              {title}
            </span>
          </Link>
        );
      })}

      <button
        onClick={checkAndNavigate}
        className="absolute left-1/2 -translate-x-1/2 top-[-1.25rem] bg-primary p-2.5 rounded-full"
        type="button"
      >
        <span className="w-fit h-fit rounded-full border border-[#FEFEFE75] text-white p-2 block">
          <IoQrCodeOutline size={25} />
        </span>
      </button>
    </nav>
  );
};

export default MobileNavbar;
