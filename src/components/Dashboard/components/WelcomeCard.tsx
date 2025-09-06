import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";

const WelcomeCard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="mt-10 mb-4 w-auto bg-dashboard-welcome-bg border border-dashboard-border rounded-[7px] box-border px-6 py-4 relative overflow-hidden">
      <div className="flex flex-row items-center gap-4 mb-3">
        <div className="w-[47px] h-[49px] bg-gray-300 rounded-full flex-shrink-0">
          <img
            src={
              user?.photoUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLn1_EIWe4MQKAqinzLYerlpzm0pyawzZbYg&s"
            }
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 gap-1">
          <div className="text-dashboard-welcome-text font-normal text-[12.4px] leading-[15px] font-inter">
            Welcome back,
          </div>
          <div className="text-dashboard-user-name font-bold text-[17.7px] leading-[21px] font-inter">
            {user?.fullName || "Logine Ahmed"}
          </div>
        </div>
      </div>
      <div className="text-dashboard-description font-normal text-[13.9px] leading-[20px] font-inter">
        Your dashboard for managing event attendance efficiently.
      </div>
    </div>
  );
};

export default WelcomeCard;
