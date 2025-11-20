import { LoadingPage, ErrorScreen, InputField, Button } from "tccd-ui";
import UseTeamEvaluationUtils from "../utils/TeamEvaluationUtils";
import { FiDownload } from "react-icons/fi";

export default function TeamEvaluationPage() {
    const { questions, isFetchingData, teamData, event, isFetchingError, assessmentScores, judgeName, handleNavigateBack, handleGetPreviousEvaluation, handleChangeAssessmentScore, handleChangeJudgeName, handleSubmitEvaluation, isSubmittingEvaluation, isFetchingPreviousEvaluation, formErrors } = UseTeamEvaluationUtils();

    if(isFetchingData) {
        return <LoadingPage />;
    }

    if(isFetchingError || !questions || !event || !teamData) {
        return <ErrorScreen message="Failed to load questions, please try again later." title="Failed to fetch data" />;
    }

    return (
        <div className="xl:w-1/2 lg:w-[60%] md:w-3/4 w-[94%] mx-auto rounded-lg bg-slate-50 shadow-md mt-4">
            <div className="space-y-3 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                    {event?.title}'s Evaluation Form
                </h1>
                <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Please fill in all the following fields according to the <strong className="text-[16px] md:text-[17px] lg:text-[18px]">{teamData?.name}</strong>'s performance on each point.
                </p>
                <p className="flex gap-1 items-center text-[14px] md:text-[15px] lg:text-[16px] text-label font-semibold">Team Name: <p className="text-[16px] md:text-[17px] lg:text-[18px] text-contrast">{teamData?.name}</p></p>
                <InputField id="judgeName-input" label="Judge Name" placeholder="Enter your full name" value={judgeName} onChange={(e) => handleChangeJudgeName(e.target.value)} />
                <Button loading={isFetchingPreviousEvaluation} type="secondary" onClick={() => handleGetPreviousEvaluation()} buttonText="Get Previous Evaluation" buttonIcon={<FiDownload className="size-3.5" />} />
                {formErrors?.name && (<div className="text-primary -mt-1 lg:text-[15px] md:text-[14px] text-[13px]">{formErrors.name}</div>)}
                <hr className="border-contrast/30" />
                {questions.map((question, index) => (
                    <div key={index} className="space-y-2 mb-6 last:mb-0">
                        <div className="flex gap-1 lg:text-[16px] md:text-[15px] text-[14px]">
                            <p className="font-semibold text-primary">{question.itemNumber}.</p>
                            <p className="text-contrast">{question.name}</p>
                        </div>
                        <div className="flex gap-2 mt-2 items-center">
                            <p className="text-contrast lg:text-[17px] md:text-[16px] text-[15px]">Score:</p>
                            <input placeholder="0" type="number" style={{ width: `${Math.max(13 * ((assessmentScores[question.id] ? assessmentScores[question.id] + 1 : 0).toString().length) + 14, 27)}px`, MozAppearance: "textfield", height: "30px" }} className="shadow-md bg-white rounded-lg text-center focus:border-primary border-gray-300 border transition-colors duration-200 outline-none text-contrast" value={assessmentScores[question.id] === -1 ? "" : assessmentScores[question.id]} onChange={(e) => handleChangeAssessmentScore(question.id, Number(e.target.value))} />
                        </div>
                        {formErrors?.questions[question.id] && (<div className="text-primary -mt-1 lg:text-[15px] md:text-[14px] text-[13px]">{formErrors.questions[question.id]}</div>)}
                    </div>
                ))}
                <hr className="border-contrast/30" />
                <div className="flex gap-2 justify-center items-center">
                    <Button disabled={isSubmittingEvaluation} type="secondary" onClick={() => handleNavigateBack()} buttonText="Cancel" />
                    <Button loading={isSubmittingEvaluation} type="primary" onClick={() => handleSubmitEvaluation()} buttonText="Submit" />
                </div>
            </div>
        </div>
    )
}