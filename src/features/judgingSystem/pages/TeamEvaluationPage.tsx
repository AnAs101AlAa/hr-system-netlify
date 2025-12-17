import { LoadingPage, ErrorScreen, Button, TextAreaField, Checkbox } from "tccd-ui";
import UseTeamEvaluationUtils from "../utils/TeamEvaluationUtils";

export default function TeamEvaluationPage() {
    const { questions, isFetchingData, teamData, event, isFetchingError, assessmentScores, handleNavigateBack, handleChangeAssessmentScore, handleSubmitEvaluation, handleChangeTeamAttendance, teamAttendance, isSubmittingEvaluation, formErrors, extraNotes, setExtraNotes } = UseTeamEvaluationUtils();
    
    if(isFetchingData) {
        return <LoadingPage />;
    }

    if(isFetchingError || !questions || !event || !teamData) {
        return <ErrorScreen message="Failed to load questions, please try again later." title="Failed to fetch data" />;
    }

    return (
        <div className="xl:w-[45%] lg:w-[58%] md:w-[70%] sm:w-[80%] w-[94%] mx-auto rounded-lg bg-slate-50 shadow-md mt-4">
            <img src="/banner.png" alt="TCCD Banner" className="w-full h-24 md:h-32 lg:h-[130px] xl:h-[150px] object-fill rounded-lg mb-3" />
            <div className="space-y-3 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                    {event?.title}'s Evaluation Form
                </h1>
                <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Please fill in all the following fields according to the <strong className="text-[16px] md:text-[17px] lg:text-[18px]">{teamData?.name}</strong>'s performance on each point.<br/>Each score should be a <strong>Decimal</strong> between <strong>0</strong> and <strong>10</strong>.
                </p>
                <div className="flex gap-1 items-center text-[16px] md:text-[18px] lg:text-[20px] text-gray-600 font-semibold">Team Name: <p className="text-contrast">{teamData?.name}</p></div>
                {formErrors?.name && (<div className="text-primary -mt-1 lg:text-[15px] md:text-[14px] text-[13px]">{formErrors.name}</div>)}
                <hr className="border-contrast/30" />

                <div className="space-y-3 flex-col flex">
                    <div className="text-[18px] md:text-[19px] lg:text-[20px] font-semibold">a) Team Attendance</div>
                    {teamData.teamMembers && teamData.teamMembers.length > 0 && teamData.teamMembers.map((member, index) => (
                        <Checkbox key={index} label={member.name} checked={!!teamAttendance.find(att => att.teamMemberId === member.id)?.attended} onChange={() => handleChangeTeamAttendance(member.id, !teamAttendance.find(att => att.teamMemberId === member.id)?.attended)} />
                    ))}
                </div>

                <hr className="my-3 border-gray-300"/>
                <div className="space-y-2 flex-col flex">
                    <div className="text-[18px] md:text-[19px] lg:text-[20px] font-semibold mb-4">b) Team Evaluation</div>
                    {questions.map((question, index) => (
                        <div key={index} className="mb-4 last:mb-0 border border-gray-200 p-2 rounded-lg">
                            <div className="flex gap-1 lg:text-[16px] md:text-[15px] text-[14px]">
                                <p className="font-semibold text-primary">{question.itemNumber}.</p>
                                <p className="text-contrast">{question.name}</p>
                            </div>
                            <div className="flex gap-2 mt-2 items-center">
                                <p className="text-contrast lg:text-[17px] md:text-[16px] text-[15px]">Score:</p>
                                <div className="flex gap-1 items-center">
                                    <input 
                                        placeholder="0" 
                                        type="number" 
                                        style={{ 
                                            width: `${Math.max((assessmentScores[question.id]?.toString().length || 1) * 11 + 14, 30)}px`,
                                            MozAppearance: "textfield", 
                                            height: "27px" 
                                        }} 
                                        className="shadow-md bg-white rounded-lg text-center focus:border-primary border-gray-300 border transition-colors duration-200 outline-none text-contrast" 
                                        value={assessmentScores[question.id] === -1 ? "" : assessmentScores[question.id]} 
                                        onChange={(e) => handleChangeAssessmentScore(question.id, Number(e.target.value))} 
                                    />
                                    <p className="text-primary font-semibold text-[17px] md:text-[18px]">/ 10.0</p>
                                </div>
                            </div>
                            {formErrors?.questions[question.id] && (<div className="text-primary -mt-1 lg:text-[15px] md:text-[14px] text-[13px]">{formErrors.questions[question.id]}</div>)}
                        </div>
                    ))}
                    <TextAreaField id="additionalComments" label="Additional Comments (Optional)" placeholder="Provide any additional comments regarding the team's performance..." value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} />
                </div>
                
                <hr className="border-contrast/30" />
                <div className="flex gap-2 justify-center items-center">
                    <Button disabled={isSubmittingEvaluation} type="secondary" onClick={() => handleNavigateBack()} buttonText="Cancel" />
                    <Button loading={isSubmittingEvaluation} type="primary" onClick={() => handleSubmitEvaluation()} buttonText="Submit" />
                </div>
            </div>
        </div>
    )
}