import { MdEvent } from "react-icons/md";
import { NavLink } from "react-router-dom";

const ActionCards = () => {
  return (
    <div className="flex flex-row justify-between gap-5 mx-auto">
      {/* <NavLink
        to={"/events/scan-qr"} className="flex-1 h-[80px] sm:h-[100px] md:h-[110px] bg-white border border-dashboard-card-border shadow-md rounded-[16px] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer">
        <div className="text-dashboard-icon text-[26px] sm:text-[32px] md:text-[35px]">
          <MdQrCodeScanner />
        </div>
        <div className="text-dashboard-card-text font-bold text-[11px] sm:text-[12px] md:text-[13px] leading-[10px] md:leading-[14px] font-inter text-center">
          Scan QR
        </div>
      </NavLink> */}

      <NavLink
        to={"/events"}
        className="flex-1 h-[80px] sm:h-[100px] md:h-[110px] bg-white border border-dashboard-card-border shadow-md rounded-[16px] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer"
      >
        <div className="text-dashboard-icon text-[26px] sm:text-[32px] md:text-[35px]">
          <MdEvent />
        </div>
        <div className="text-dashboard-card-text font-bold text-[11px] sm:text-[12px] md:text-[13px] leading-[10px] md:leading-[14px] font-inter text-center">
          Events
        </div>
      </NavLink>
    </div>
  );
};

export default ActionCards;
