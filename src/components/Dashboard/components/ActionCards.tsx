import { MdQrCodeScanner, MdEvent } from "react-icons/md";

const ActionCards = () => {
  return (
    <div className="flex flex-row justify-between gap-4 sm:gap-15 md:gap-8 mx-1">
      <div className="flex-1 max-w-[400px] h-[110px] sm:h-[140px] bg-white border border-dashboard-card-border shadow-md rounded-[16px] flex flex-col items-center justify-center gap-2 p-3">
        <div className="text-dashboard-icon text-[35px] sm:text-[39px] md:text-[42px]">
          <MdQrCodeScanner />
        </div>
        <div className="text-dashboard-card-text font-bold text-[12px] sm:text-[13px] md:text-[14px] leading-[12px] md:leading-[14px] font-inter text-center">
          Scan QR
        </div>
      </div>

      <div className="flex-1 max-w-[400px] h-[110px] sm:h-[140px] bg-white border border-dashboard-card-border shadow-md rounded-[16px] flex flex-col items-center justify-center gap-2 p-3">
        <div className="text-dashboard-icon text-[35px] sm:text-[39px] md:text-[42px]">
          <MdEvent />
        </div>
        <div className="text-dashboard-card-text font-bold text-[12px] sm:text-[13px] md:text-[14px] leading-[12px] md:leading-[14px] font-inter text-center">
          Events
        </div>
      </div>
    </div>
  );
};

export default ActionCards;
