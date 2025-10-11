import { format } from "../../utils";
import type { form } from "@/types/form";
import { ButtonTypes, Button } from "tccd-ui";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import FormDeleteModal from "./FormDeleteModal";
import { useModifyFormStatus } from "@/queries/forms/formQueries";
import { getErrorMessage } from "@/utils";

interface FormCardViewProps {
  forms: form[];
}

const FormCardView = ({
  forms
}: FormCardViewProps) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [displayedForms, setDisplayedForms] = useState<form[]>(forms);
  const modifyFormStatusMutation = useModifyFormStatus();
  
  const handleModifyStatus = (formId: string, isClosed: boolean) => {
    toast.promise(
      new Promise((resolve, reject) => {
        modifyFormStatusMutation.mutate(
          { formId, isClosed },
          {
            onSuccess: () => {
              setShowDeleteModal("");
              setDisplayedForms((prevForms) =>
                prevForms.map((form) =>
                  form.id === formId ? { ...form, isClosed } : form
                )
              );
              resolve(true);
            },
            onError: (error: unknown) => {
              reject(error);
            },
          }
        );
      }),
      {
        loading: isClosed ? "Closing form..." : "Opening form...",
        success: isClosed ? "Form closed" : "Form opened",
        error: (err) => `Error: ${getErrorMessage(err) || "Failed to modify form status"}`,
      }
    );
  };
  
  useEffect(() => {
    setDisplayedForms(forms);
  }, [forms]);

  return (
    <div className="lg:hidden divide-y divide-gray-100">
      <FormDeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
      {displayedForms && displayedForms.length > 0 ? (
        displayedForms.map((form, index) => (
          <div key={form.id || index} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-inactive-tab-text text-[16px] md:text-[18px]">
                  {form.title || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <span className="font-medium text-dashboard-heading">
                  Created At:
                </span>
                <p className="text-dashboard-card-text">
                  {format(form.createdAt, "stringed") || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Updated At:
                </span>
                <p className="text-dashboard-card-text">
                  {format(form.updatedAt, "stringed") || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end items-center gap-3">
                <Button
                  type={ButtonTypes.TERTIARY}
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`); toast.success("Form link copied to clipboard") }}
                  buttonText="Copy Link"
                />
                <Button
                    type={ButtonTypes.SECONDARY}
                    onClick={() => navigate(`/form-builder/${form.id}`)}
                    buttonText="Edit"
                />
                {form.isClosed ? (
                  <div className="w-20">
                    <Button
                      type={ButtonTypes.PRIMARY}
                      onClick={() => handleModifyStatus(form.id, false)}
                      buttonText="Unlock"
                      disabled={modifyFormStatusMutation.isPending && modifyFormStatusMutation.variables?.formId === form.id}
                      width="full"/>
                  </div>
                  ) : (
                  <div className="w-20">
                    <Button
                      type={ButtonTypes.PRIMARY}
                      onClick={() => handleModifyStatus(form.id, true)}
                      buttonText="Lock"
                      disabled={modifyFormStatusMutation.isPending && modifyFormStatusMutation.variables?.formId === form.id}
                      width="full"/>
                  </div>
                )}
                <Button
                    type={ButtonTypes.DANGER}
                    onClick={() => setShowDeleteModal(form.id || "")}
                    buttonText="Delete"
                />
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="text-dashboard-description">
            <p className="text-lg font-medium">No Forms found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormCardView;
