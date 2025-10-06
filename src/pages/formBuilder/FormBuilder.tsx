import WithNavbar from "@/components/hoc/WithNavbar";
import FormList from "@/components/formBuilder/FormList";
import { useForms } from "@/queries/forms/formQueries";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { ButtonTypes, LoadingPage, Button } from "tccd-ui";

export default function FormBuilder() {

    const { data: Forms, isLoading, isError, error } = useForms();

    useEffect(() => {
        if (isError && error) {
            toast.error(`Failed to fetch forms, please try again`);
        }
    }, [isError, error]);

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <WithNavbar>
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto">
            <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold mb-4">Form Builder</h1>
                <div className="w-full my-4">
                <Button buttonText="New Form" onClick={() => window.location.href = "/form-builder/new"} type={ButtonTypes.PRIMARY} width="small" />
                </div>
                <FormList Forms={Forms || []} />
            </div>
        </div>
        </WithNavbar>
    )
}
