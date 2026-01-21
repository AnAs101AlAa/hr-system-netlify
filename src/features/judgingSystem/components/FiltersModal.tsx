import { Modal, SearchField, Button, DropdownMenu } from "tccd-ui";
import type { FilterSearchParams } from "../types";
import { useState } from "react";
import DEPARTMENT_LIST from "@/constants/departments";

export default function FilterModal({
  isOpen,
  onClose,
  searchParams,
}: {
  isOpen: boolean;
  onClose: () => void;
  searchParams: FilterSearchParams;
}) {
  const [localNameKey, setLocalNameKey] = useState(searchParams.nameKey);
  const [localCodeKey, setLocalCodeKey] = useState(searchParams.codeKey);
  const [localDepartmentKey, setLocalDepartmentKey] = useState(
    searchParams.departmentKey
  );
  const [localCourseKey, setLocalCourseKey] = useState(searchParams.courseKey);

  const onConfirm = () => {
    searchParams.setNameKey(localNameKey);
    searchParams.setCodeKey(localCodeKey);
    searchParams.setDepartmentKey(localDepartmentKey);
    searchParams.setCourseKey(localCourseKey);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Teams">
      <div className="space-y-5 mt-2 w-full">
        <div className="w-full">
          <p className="lg:text-[16px] md:text-[15px] text-[14px] font-medium mb-2 text-text-body-main">
            Department
          </p>
          <DropdownMenu
            placeholder="Select Department"
            options={[
              { label: "All Departments", value: "" },
              ...DEPARTMENT_LIST,
            ]}
            value={localDepartmentKey}
            onChange={(value) => setLocalDepartmentKey(value)}
          />
        </div>
        <div className="w-full">
          <p className="lg:text-[16px] md:text-[15px] text-[14px] font-medium mb-2 text-text-body-main">
            Team Name
          </p>
          <SearchField
            className="lg:w-full"
            placeholder="Search by team name"
            value={localNameKey}
            onChange={(value) => setLocalNameKey(value)}
          />
        </div>
        <div className="w-full">
          <p className="lg:text-[16px] md:text-[15px] text-[14px] font-medium mb-2 text-text-body-main">
            Team Code
          </p>
          <SearchField
            className="lg:w-full"
            placeholder="Search by team code"
            value={localCodeKey}
            onChange={(value) => setLocalCodeKey(value)}
          />
        </div>
        <div className="w-full">
          <p className="lg:text-[16px] md:text-[15px] text-[14px] font-medium mb-2 text-text-body-main">
            Course
          </p>
          <SearchField
            className="lg:w-full"
            placeholder="Search by course"
            value={localCourseKey}
            onChange={(value) => setLocalCourseKey(value)}
          />
        </div>
        <div className="flex justify-center mt-2">
          <Button type="primary" onClick={onConfirm} buttonText="Confirm" />
        </div>
      </div>
    </Modal>
  );
}
