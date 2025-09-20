import type { form } from "@/types/form";
import Button from "../generics/Button";
import Format from "@/utils/Formater";
import { ButtonTypes } from "@/constants/presets";
import { useNavigate } from "react-router-dom";

interface FormsTableProps {
    forms: form[];
}

const FormTable = ({ forms }: FormsTableProps) => {
    const navigate = useNavigate();

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Title
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Created At
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Updated At
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {forms && forms.length > 0 ? (
            forms.map((form, index) => (
              <tr
                key={form.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {form.title || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {Format(form.createdAt, 'stringed') || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {Format(form.updatedAt, 'stringed') || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type={ButtonTypes.SECONDARY}
                      onClick={() => navigate(`/form-builder/${form.id}`)}
                      buttonText="Edit"
                    />
                    <Button
                      type={ButtonTypes.DANGER}
                      onClick={() => navigate(`/forms/${form.id}`)}
                      buttonText="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center">
                <div className="text-dashboard-description">
                  <p className="text-lg font-medium">No forms found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FormTable;
