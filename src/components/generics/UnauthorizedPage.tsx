import { HiMiniXMark } from "react-icons/hi2";

export default function UnauthorizedPage() {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-background">
            <div className="w-fit rounded-2xl bg-background p-8 shadow-[0_0px_20px_rgba(0,0,0,0.2)]  flex flex-col items-center">
            <div className="rounded-full bg-muted-primary md:p-4 p-2 mb-4 md:mb-6 lg:mb-8 w-fit">
                <HiMiniXMark className="text-[52px] md:text-[56px] lg:text-[60px] text-primary" />
            </div>
            <p className="text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-2 md:mb-4">Unauthorized Access</p>
            <p className="text-[14px] md:text-[16px] text-center max-w-md text-inactive-tab-text font-medium">
                Sorry, you do not have the necessary permissions to view this page .
            </p>
            </div>
        </div>
    )
}