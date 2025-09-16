import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import LazyImageLoader from "@/components/generics/LazyImageLoader";

const WelcomeCard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="mt-10 mb-4 w-auto bg-dashboard-welcome-bg border border-dashboard-border rounded-[7px] box-border px-6 py-4 relative overflow-hidden">
      <div className="flex flex-row items-center gap-4 mb-3">
        <div
          className="w-[70px] h-[70px] bg-gray-300 rounded-full flex-shrink-0  sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px] xl:w-[110px] xl:h-[110px] flex items-center justify-center
        overflow-hidden"
        >
          <LazyImageLoader
            src={
              user?.profileImageUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLn1_EIWe4MQKAqinzLYerlpzm0pyawzZbYg&s"
            }
            alt="User Avatar"
            className="rounded-full"
            width="100%"
            height="100%"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 gap-1">
          <div className="text-dashboard-welcome-text font-normal text-[13.4px] leading-[15px] font-inter sm:text-[15px] sm:leading-[18px] md:text-[16px] md:leading-[19px] lg:text-[17px] lg:leading-[20px] xl:text-[18px] xl:leading-[21px]">
            Welcome back,
          </div>
          <div className="text-dashboard-user-name font-bold text-[19.7px] leading-[23px] font-inter sm:text-[21px] sm:leading-[24px] md:text-[22px] md:leading-[26px] lg:text-[24px] lg:leading-[28px] xl:text-[26px] xl:leading-[30px]">
            {user?.name || "Logine Ahmed"}
          </div>
        </div>
      </div>
      <div className="text-dashboard-description font-normal text-[14.9px] leading-[20px] font-inter sm:text-[16px] sm:leading-[22px] md:text-[17px] md:leading-[23px] lg:text-[18px] lg:leading-[24px] xl:text-[19px] xl:leading-[25px]">
        Your dashboard for managing event attendance efficiently.
      </div>
    </div>
  );
};

export default WelcomeCard;
