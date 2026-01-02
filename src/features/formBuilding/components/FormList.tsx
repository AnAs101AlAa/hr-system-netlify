import { SearchField, DropdownMenu, DatePicker, ErrorScreen } from "tccd-ui";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FORM_SORTING_OPTIONS, FORM_TYPES } from "@/constants/formConstants";
import { useForms } from "@/shared/queries/forms/formQueries";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import { Button } from "tccd-ui";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import type { form } from "@/shared/types/form";
import { useModifyFormStatus } from "@/shared/queries/forms/formQueries";
import { getErrorMessage } from "@/shared/utils";
import FormDeleteModal from "./FormDeleteModal";
import { IoTrashSharp } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa6";
import { FaEdit, FaLock, FaUnlock } from "react-icons/fa";

const FormList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchKey);
  const [displayedForms, setDisplayedForms] = useState<form[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const modifyFormStatusMutation = useModifyFormStatus();
  const userRoles = useSelector((state: any) => state.auth?.user.roles);

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
    const t = setTimeout(() => setDebouncedSearchTerm(searchKey), 300);
    return () => clearTimeout(t);
  }, [searchKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const [sortOption, setSortOption] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const {
    data: Forms,
    isLoading,
    isError,
  } = useForms(
    currentPage,
    15,
    selectedDate || "",
    debouncedSearchTerm,
    filterType,
    sortOption
  );

  useEffect(() => {
    setDisplayedForms(Forms || []);
  }, [Forms]);

  if (isError) {
    return (
      <ErrorScreen
        title={"An error occurred while fetching forms."}
        message="an error occurred while fetching forms, please try again and contact IT team if the issue persists."
      />
    );
  }

  return (
    <div className="bg-white dark:bg-surface-glass-bg rounded-lg shadow-sm border border-dashboard-card-border dark:border-surface-glass-border/10 overflow-hidden">
      <FormDeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
      <div className="p-4 border-b border-dashboard-border dark:border-surface-glass-border/10 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A] dark:text-text-title">
            Forms {Forms ? `(${Forms.length})` : ""}
          </p>
          <div className="flex gap-2 items-center justify-center">
            <FaChevronLeft
              className={`cursor-pointer size-4 ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-contrast hover:text-primary"
              }`}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
            />
            <span className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-contrast">
              Page {currentPage}
            </span>
            <FaChevronRight
              className={`cursor-pointer size-4 ${
                Forms && Forms.length < 15
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-contrast hover:text-primary"
              }`}
              onClick={() => {
                if (Forms && Forms.length === 15) {
                  setCurrentPage(currentPage + 1);
                }
              }}
            />
          </div>
        </div>
        <>
          <div
            className="flex items-center gap-2 small-scrollbar"
            style={{ overflowX: "auto", overflowY: "hidden" }}
          >
            {FORM_TYPES.map((type) => (
              <div
                key={type.value}
                className={`px-3 py-1 rounded-md text-sm font-semibold ${
                  filterType === type.value
                    ? "text-primary scale-[110%]"
                    : "text-contrast scale-[100%]"
                } transition-all duration-200 cursor-pointer whitespace-nowrap`}
                onClick={() => setFilterType(type.value)}
              >
                {type.label}
              </div>
            ))}
          </div>

          <style>{`
            .small-scrollbar {
              -ms-overflow-style: auto; /* IE and Edge */
              scrollbar-width: thin; /* Firefox */
            }
            .small-scrollbar::-webkit-scrollbar {
              height: 8px;
              width: 8px;
            }
            .small-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(0,0,0,0.25);
              border-radius: 8px;
            }
            .small-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 8px;
            }
          `}</style>
        </>
        <hr className="border-gray-200 dark:border-surface-glass-border/10" />
        <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-contrast">
          Filters
        </p>
        <div className="flex gap-2 md:flex-row flex-col justify-between">
          <SearchField
            placeholder="Search forms..."
            value={searchKey}
            onChange={(value) => setSearchKey(value)}
          />
          <div className="flex-col flex flex-1 justify-end md:flex-row gap-2">
            <div className="flex-grow md:max-w-64">
              <DropdownMenu
                options={FORM_SORTING_OPTIONS}
                value={sortOption}
                onChange={(val) => setSortOption(val)}
                placeholder="Sort By"
              />
            </div>
            <div className="flex-grow md:max-w-64 md:-mt-0.5">
              <DatePicker
                value={selectedDate || ""}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-contrast">Loading forms...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <Table
            items={displayedForms || []}
            columns={[
              { key: "title", label: "Title", width: "w-auto" },
              { key: "createdAt", label: "Created At", width: "w-auto", formatter: (value) => value ? new Date(value).toLocaleDateString() : "N/A" },
              { key: "updatedAt", label: "Updated At", width: "w-auto", formatter: (value) => value ? new Date(value).toLocaleDateString() : "N/A" },
            ]}
            emptyMessage="No forms found."
            renderActions={(item) => (
              <>
                  <Button
                      type="tertiary"
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/form/${item.id}`); toast.success("Form link copied to clipboard") }}
                      buttonText="Copy Link"
                      width="small"
                    />
                    <Button
                      type="secondary"
                      onClick={() => navigate(`/form-builder/${item.id}`)}
                      buttonText="Edit"
                      width="fit"
                    />
                    {item.isClosed ? (
                      <div className="w-20">
                        <Button
                          type="primary"
                          onClick={() => handleModifyStatus(item.id, false)}
                          buttonText="Unlock"
                          disabled={modifyFormStatusMutation.isPending && modifyFormStatusMutation.variables?.formId === item.id}
                          width="full"/>
                      </div>
                      ) : (
                      <div className="w-20">
                        <Button
                          type="primary"
                          onClick={() => handleModifyStatus(item.id, true)}
                          buttonText="Lock"
                          disabled={modifyFormStatusMutation.isPending && modifyFormStatusMutation.variables?.formId === item.id}
                          width="full"/>
                      </div>
                    )}
                    {userRoles.includes("Admin") && userRoles.length === 1  && (
                      <Button
                        type="danger"
                        onClick={() => setShowDeleteModal(item.id)}
                        buttonText="Delete"
                        width="fit"
                      />
                    )}
              </>
            )}
          />
          <CardView
            items={displayedForms || []}
            titleKey="title"
            renderedFields={[
              {key: "createdAt", label: "Created At", formatter: (value) => value ? new Date(value).toLocaleDateString() : "N/A" },
              {key: "updatedAt", label: "Updated At", formatter: (value) => value ? new Date(value).toLocaleDateString() : "N/A" },
            ]}
            modalTitle="Confirm Action"
            modalSubTitle="Are you sure you want to perform this action?"
            confirmationAction={() => {}}
            isSubmitting={false}
            renderButtons={(item) => (
              <>
                  <Button
                      buttonIcon={<FaRegCopy className="size-4" />}
                      type="tertiary"
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/form/${item.id}`); toast.success("Form link copied to clipboard") }}
                      width="auto"
                    />
                    <Button
                      buttonIcon={<FaEdit className="size-4" />}
                      type="secondary"
                      onClick={() => navigate(`/form-builder/${item.id}`)}
                      width="auto"
                    />
                    {item.isClosed ? (
                      <div className="w-20">
                        <Button
                          buttonIcon={<FaUnlock className="size-4" />}
                          type="primary"
                          onClick={() => handleModifyStatus(item.id, false)}
                          disabled={modifyFormStatusMutation.isPending && modifyFormStatusMutation.variables?.formId === item.id}
                          width="full"/>
                      </div>
                      ) : (
                      <div className="w-20">
                        <Button
                          buttonIcon={<FaLock className="size-4" />}
                          type="primary"
                          onClick={() => handleModifyStatus(item.id, true)}
                          disabled={modifyFormStatusMutation.isPending && modifyFormStatusMutation.variables?.formId === item.id}
                          width="full"/>
                      </div>
                    )}
                    {userRoles.includes("Admin") && userRoles.length === 1  && (
                      <Button
                        buttonIcon={<IoTrashSharp className="size-4" />}
                        type="danger"
                        onClick={() => setShowDeleteModal(item.id)}
                        width="auto"
                      />
                    )}
              </>
            )}
          />
          {/* Mobile Card View */}
        </>
      )}
    </div>
  );
};

export default FormList;
