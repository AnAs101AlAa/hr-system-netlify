import WithNavbar from "@/shared/components/hoc/WithNavbar";
import TeamsPage from "./TeamPage";
import QUestionManagePage from "./QuestionManagePage";
import { useEvent } from "@/shared/queries/events";
import { useParams } from "react-router-dom";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useState, Activity } from "react";
import { useSelector } from "react-redux";
import ConditionalWrapper from "@/shared/utils/conditionalWrapper";

export default function JudgingSystemHomePage() {
    const { eventId } = useParams();
    const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
    const isJudge = userRoles.includes("Judge") && userRoles.length === 1;
    const [activeTab, setActiveTab] = useState<string>("teams");
    const { data: event, isLoading, isError } = useEvent(eventId!);

    if(isLoading) {
        return <LoadingPage />;
    }

    if(isError || !event) {
        return <ErrorScreen message="Failed to load event data, please try again later." title="Failed to fetch data" />;
    }

    const children = (
        <div className="min-h-screen bg-background p-4 w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto">
            <p className="text-center text-[22px] md:text-[24px] lg:text-[26px] text-primary font-semibold">{event?.title}'s Judging Board</p>
            <p className="text-center mb-4 md:mb-6 lg:text-[16px] md:text-[15px] text-[14px] text-inactive-tab-text">Manage teams and their scoring for this event.</p>
            {!isJudge && (
                <div className="flex flex-row justify-between mx-auto border-b-2 border-primary shadow-md w-full md:w-2/3 lg:w-1/2 mb-5">
                    <div onClick={() => setActiveTab("teams")} className={`flex-1 hover:bg-muted-primary/30 ${activeTab === "teams" ? "bg-muted-primary/15" : "bg-white"} transition-colors duration-200 ease-in-out py-4 md:py-5 shadow-lg flex items-center justify-center p-2 cursor-pointer`}>
                    <div className="text-dashboard-card-text font-bold text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] leading-[10px] md:leading-[14px] font-inter text-center">
                        Teams
                    </div>
                    </div>
                    <div onClick={() => setActiveTab("questions")} className={`flex-1 hover:bg-muted-primary/30 ${activeTab === "questions" ? "bg-muted-primary/15" : "bg-white"} transition-colors duration-200 ease-in-out shadow-lg flex items-center justify-center p-2 cursor-pointer`}>
                        <div className="text-dashboard-card-text font-bold text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] leading-[10px] md:leading-[14px] font-inter text-center">
                            Question
                        </div>
                    </div>
                </div>
            )}
            <Activity mode={activeTab === "teams" && !isJudge ? "visible" : "hidden"}>
                <QUestionManagePage event={event} />
            </Activity>
            <Activity mode={activeTab === "questions" || isJudge ? "visible" : "hidden"}>
                <TeamsPage event={event} mode={!isJudge} />
            </Activity>
        </div>
    )
    
    return (
        <ConditionalWrapper condition={!isJudge} wrapper={(children) => <WithNavbar>{children}</WithNavbar>}>
            {children}
        </ConditionalWrapper>
    );
}