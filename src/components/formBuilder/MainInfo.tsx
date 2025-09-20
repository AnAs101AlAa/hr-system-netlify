import InputField from "@/components/generics/InputField";
import TextAreaField from "@/components/generics/TextAreaField";
import type { form } from "@/types/form";
import { forwardRef, useImperativeHandle } from "react";
import type { FormEditorHandle } from "@/types/form";
import { useState } from "react";

interface MainInfoProps {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, toChange: string) => void;
    formDataState: form;
}

const MainInfo = forwardRef<FormEditorHandle, MainInfoProps>(({ handleInputChange, formDataState }, ref) => {
    const [errors, setErrors] = useState<string[]>(["", "", "", ""]);
    
    const collectErrors = (): boolean => {
        const currentErrors: string[] = ["", "", "", ""];
        if (!formDataState.id || formDataState.id.trim() === "") {
            currentErrors[0] = "Sheet Id is required.";
        }
        if (!formDataState.sheetName || formDataState.sheetName.trim() === "") {
            currentErrors[1] = "Sheet/Tab Name is required.";
        }
        if (!formDataState.title || formDataState.title.trim() === "") {
            currentErrors[2] = "Form Title is required.";
        }
        if(!formDataState.description || formDataState.description.trim() === "") {
            currentErrors[3] = "Form Description is required.";
        }

        setErrors(currentErrors);
        if (currentErrors.some(error => error !== "")) {
            return true;
        }
        return false;
    }

    useImperativeHandle(ref, () => ({
        collect: collectErrors
    }));

    return (
        <>
        <div className="space-y-3 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
            <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary">
                Google Sheet Details
            </p>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                The form responses will be saved in a Google Sheet. Please provide the necessary details below.
            </p>
            <InputField
                label="Sheet Id"
                id="form-id"
                value={formDataState?.id || ""}
                placeholder="enter id here"
                onChange={(e) => handleInputChange(e, "id")}
                error={errors[0]}
            />
            {errors[0] && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{errors[0]}</p>}
            <InputField
                label="Sheet/Tab Name"
                id="form-tab-name"
                value={formDataState?.sheetName || ""}
                placeholder="e.g. Sheet1"
                onChange={(e) => handleInputChange(e, "sheetName")}
                error={errors[1]}
            />
            {errors[1] && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{errors[1]}</p>}
        </div>
        <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
            <p className="pageErrors font-semibold text-primary">
                Form Main Information
            </p>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Provide a title and description for your form. This information will be displayed to respondents.
            </p>
            <InputField
                label="Form Title"
                id="form-title"
                value={formDataState?.title || ""}
                placeholder="e.g. Orientation title"
                onChange={(e) => handleInputChange(e, "title")}
                error={errors[2]}
            />
            {errors[2] && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{errors[2]}</p>}
            <TextAreaField
                label="Form Description"
                id="form-description"
                value={formDataState?.description || ""}
                placeholder="e.g. Orientation description"
                onChange={(e) => handleInputChange(e, "description")}
                error={errors[3]}
            />
            {errors[3] && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{errors[3]}</p>}
        </div>
        </>
    )
});

export default MainInfo;