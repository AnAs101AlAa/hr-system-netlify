import { format } from "../../utils";
import type { form } from "@/types/form";
import Button from "../generics/Button";
import { ButtonTypes } from "@/constants/presets";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface FormCardViewProps {
  forms: form[];
}

const FormCardView = ({
  forms,
}: FormCardViewProps) => {
    const navigate = useNavigate();

  return (
    <div className="lg:hidden divide-y divide-gray-100">
      {forms && forms.length > 0 ? (
        forms.map((form, index) => (
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
                <Button
                    type={ButtonTypes.DANGER}
                    onClick={() => navigate(`/form-builder/${form.id}/submissions`)}
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
