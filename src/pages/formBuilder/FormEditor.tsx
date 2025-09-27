import { useParams } from "react-router-dom";
import { useForm, useCreateForm } from "@/queries/forms/formQueries";
import LoadingPage from "@/components/generics/LoadingPage";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import WithNavbar from "@/components/hoc/WithNavbar";
import type { form } from "@/types/form";
import Button from "@/components/generics/Button";
import { ButtonTypes } from "@/constants/presets";
import MainInfo from "@/components/formBuilder/MainInfo";
import PagesInfo from "@/components/formBuilder/PagesInfo";
import type { FormEditorHandle } from "@/types/form";
import { getErrorMessage } from "@/utils";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "@/components/generics/Error";

export default function FormEditor() {
    const { formId } = useParams<{ formId: string }>();
    const isEditMode = formId !== "new";
    const emptyForm: form = { id: "", title: "", sheetName: "", pages: [], description: "", googleSheetId: "", createdAt: "", updatedAt: "" };

    const { data: formData, isLoading, isError, error } = useForm(formId!);

    const createFormMutation = useCreateForm();
    const [formDataState, setFormDataState] = useState<form>(emptyForm);

        
    const mainSectionRef = useRef<FormEditorHandle | null>(null);
    const pagesSectionRef = useRef<FormEditorHandle | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isError && error) {
            toast.error(`Failed to fetch form, please try again`);
        }
        if (formData) {
            setFormDataState(formData);
        }
    }, [isError, error, formData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        toChange: string,
        index?: number,
        field?: string
    ) => {
        const value = e.target.value;
        if (toChange === "pages" && typeof index === "number") {
            setFormDataState((prev) => {
                if (!prev || !prev.pages) return prev;
                const updatedPages = [...prev.pages];
                updatedPages[index] = { ...updatedPages[index], [field!]: value };
                return { ...prev, pages: updatedPages };
            });
            return;
        }

        setFormDataState((prev) => {
            if (!prev) return prev;
            return { ...prev, [toChange]: value };
        });
    }

    const validateForm = () => {
        let hasErrors = false;
        hasErrors = mainSectionRef.current?.collect() || hasErrors;
        hasErrors = pagesSectionRef.current?.collect() || hasErrors;
        return !hasErrors;
    }

    const handleCreateForm = async () => {
        toast.promise(
            new Promise((resolve, reject) => {
                if (!validateForm()) {
                    reject("Form validation failed. Please check your inputs.");
                    return;
                }
                createFormMutation.mutate(formDataState, {
                    onSuccess: () => {
                        setFormDataState(emptyForm);
                        resolve(true);
                        setTimeout(() => {
                            navigate("/form-builder");
                        }, 1500);
                    },
                    onError: (error: unknown) => {
                        const errorMessage = getErrorMessage(error) || "Failed to create form";
                        reject(errorMessage);
                    },
                });
            }),
            {
                loading: "Creating form...",
                error: (err) => typeof err === "string"
                    ? err
                    : isEditMode
                        ? "Failed to update form"
                        : "Failed to create form",
                success: "Form created successfully",
            }
        );
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    if(isError) {
        return <ErrorComponent title="Error loading form" message="failed to fetch form data please try again later or contact IT team" />;
    }

    return (
        <WithNavbar>
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto">
            <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold mb-4">{isEditMode ? `Edit Form` : "Create New Form"}</h1>
            <div className="space-y-6">
                <MainInfo handleInputChange={handleInputChange} formDataState={formDataState} ref={mainSectionRef} />
                <PagesInfo formDataState={formDataState} setFormDataState={setFormDataState} handleInputChange={handleInputChange} ref={pagesSectionRef} />

                <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                    <div className="flex justify-center items-center gap-3">
                        <Button type={ButtonTypes.SECONDARY} onClick={() => {}} buttonText="Discard" />
                        <Button type={ButtonTypes.PRIMARY} onClick={() => handleCreateForm()} buttonText="Save Form" />
                    </div>
                </div>
            </div>
        </div>
        </div>
        </WithNavbar>
    );
}