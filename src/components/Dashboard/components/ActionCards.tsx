import { MdQrCodeScanner, MdEvent } from "react-icons/md";

const ActionCards = () => {
  return (
    <div className="flex flex-row justify-between gap-5 mx-auto">
      <div className="flex-1 h-[100px] sm:h-[120px] md:h-[150px] bg-white border border-dashboard-card-border shadow-md rounded-[16px] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer">
        <div className="text-dashboard-icon text-[30px] sm:text-[35px] md:text-[38px]">
          <MdQrCodeScanner />
        </div>
        <div className="text-dashboard-card-text font-bold text-[11px] sm:text-[12px] md:text-[13px] leading-[10px] md:leading-[14px] font-inter text-center">
          Scan QR
        </div>
      </div>

      <div className="flex-1 h-[100px] sm:h-[120px] md:h-[150px] bg-white border border-dashboard-card-border shadow-md rounded-[16px] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer">
        <div className="text-dashboard-icon text-[30px] sm:text-[35px] md:text-[38px]">
          <MdEvent />
        </div>
        <div className="text-dashboard-card-text font-bold text-[11px] sm:text-[12px] md:text-[13px] leading-[10px] md:leading-[14px] font-inter text-center">
          Events
        </div>
      </div>
    </div>
  );
};

export default ActionCards;
