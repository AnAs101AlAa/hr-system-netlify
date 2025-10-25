import { useForm, useCreateForm, useUpdateForm } from "@/queries/forms/formQueries";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import WithNavbar from "@/components/hoc/WithNavbar";
import type { form, formPage } from "@/types/form";
import MainInfo from "@/components/formBuilder/MainInfo";
import PagesInfo from "@/components/formBuilder/PagesInfo";
import type { FormEditorHandle, FormEditorPageHandle } from "@/types/form";
import { getErrorMessage } from "@/utils";
import { useNavigate } from "react-router-dom";
import { LoadingPage, ErrorScreen, Button, ButtonTypes } from "tccd-ui";
import { useParams, useSearchParams } from "react-router-dom";

export default function FormEditor() {
    const navigate = useNavigate();
    const { formId } = useParams<{ formId: string }>();
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get("template") || "";
    const isEditMode = formId !== "new";

    const emptyForm: form = { id: "", title: "", formType: "", sheetName: "", pages: [], description: "", googleSheetId: "", googleDriveId: "", isClosed: false, createdAt: "", updatedAt: "" };

    const { data: formData, isLoading, isError, error } = useForm(formId !== "new" ? formId ?? "" : templateId ?? "", true);

    const createFormMutation = useCreateForm();
    const updateFormMutation = useUpdateForm(formId ?? "");
    const [formDataState, setFormDataState] = useState<form>(emptyForm);
    const [questionCount, setQuestionCount] = useState(0);
        
    const mainSectionRef = useRef<FormEditorHandle | null>(null);
    const pagesSectionRef = useRef<FormEditorPageHandle | null>(null);

    const calcQuestionCount = (pages?: formPage[]) =>
        (pages ?? []).reduce((acc, page) => acc + (page.questions?.length ?? 0), 0);

    useEffect(() => {
        setQuestionCount(calcQuestionCount(formDataState.pages));
    }, [formDataState.pages]);

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
        const pageValidated = pagesSectionRef.current?.collect() || { hasErrors: false, pages: [] };
        hasErrors = pageValidated.hasErrors || hasErrors;
        return { hasErrors, pages: pageValidated.pages || [] };
    }

    const handleCreateForm = async () => {
        if( isEditMode ) {
            toast.promise(
                new Promise((resolve, reject) => {
                    const validationResult = validateForm();
                    if (validationResult.hasErrors) {
                        reject("Form validation failed. Please check your inputs.");
                        return;
                    }

                    updateFormMutation.mutate({...formDataState, pages: validationResult.pages}, {
                        onSuccess: () => {
                            resolve(true);
                            setTimeout(() => {
                                navigate("/form-builder");
                            }, 1500);
                        },
                        onError: (error: unknown) => {
                            const errorMessage = getErrorMessage(error) || "Failed to update form";
                            reject(errorMessage);
                        },
                    });
                }),
                {
                    loading: "Updating form...",
                    error: (err) => typeof err === "string"
                        ? err
                        : isEditMode
                            ? "Failed to update form"
                            : "Failed to create form",
                    success: "Form updated successfully",
                }
            );
            return;
        } else {
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
    }

    const handlePreviewForm = () => {
        const collectedFormData = validateForm();
        if (collectedFormData.hasErrors) {
            toast.error("Form validation failed. Please check your inputs.");
            return;
        }

        const finalized = { ...formDataState, pages: collectedFormData.pages };
        localStorage.setItem("previewFormData", JSON.stringify(finalized));
        const previewUrl = "/form-builder/preview";
        window.open(previewUrl, "_blank", "noopener,noreferrer");
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    if(isError) {
        return <ErrorScreen title="Error loading form" message="failed to fetch form data please try again later or contact IT team" />;
    }

    return (
        <WithNavbar>
        <div className="min-h-screen bg-background p-3 md:p-4">
            <div className="max-w-6xl mx-auto">
            <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold mb-4">{isEditMode ? `Edit Form` : "Create New Form"}</h1>
            <div className="space-y-6">
                <MainInfo handleInputChange={handleInputChange} formDataState={formDataState} ref={mainSectionRef} />
                <PagesInfo questionCount={questionCount} setQuestionCount={setQuestionCount} formDataState={formDataState} setFormDataState={setFormDataState} handleInputChange={handleInputChange} ref={pagesSectionRef} />

                <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                    <div className="flex justify-center items-center gap-3">
                        <Button type={ButtonTypes.DANGER} onClick={() => navigate(-1)} buttonText="Discard" />
                        <Button type={ButtonTypes.SECONDARY} onClick={() => { handlePreviewForm(); }} buttonText="Preview" />
                        <Button type={ButtonTypes.PRIMARY} onClick={() => handleCreateForm()} loading={createFormMutation.isPending || updateFormMutation.isPending} buttonText="Save Form" />
                    </div>
                </div>
            </div>
        </div>
        </div>
        </WithNavbar>
    );
}