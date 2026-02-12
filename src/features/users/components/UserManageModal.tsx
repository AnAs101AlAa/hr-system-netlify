import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  InputField,
  DropdownMenu,
  ButtonTypes,
  ButtonWidths,
  NumberField,
} from "tccd-ui";
import type { member } from "@/shared/types/member";
import { useCreateUser, useUpdateUser } from "@/shared/queries/users";
import { memberSchema, type MemberFormData } from "@/shared/schemas/memberSchemas";
import { COMMITTEES_OPTIONS, EDUCATION_SYSTEMS, POSITIONS } from "@/constants/usersConstants";
import DEPARTMENT_LIST from "@/constants/departments";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: member | null; // null for create, Event for edit
  mode: "create" | "edit";
}

const UserManageModal = ({ isOpen, onClose, user, mode }: UserModalProps) => {
  const [formData, setFormData] = useState<MemberFormData>({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    committee: "",
    position: "",
    nationalId: "",
    engineeringMajor: "",
    educationSystem: "",
    gradYear: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && user) {
        setFormData({
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          committee: user.committee,
          position: user.position || "",
          nationalId: user.nationalId,
          engineeringMajor: user.engineeringMajor,
          educationSystem: user.educationSystem,
          gradYear: user.gradYear,
        });
      } else {
        setFormData({
          id: "",
          name: "",
          email: "",
          phoneNumber: "",
          committee: "",
          position: "",
          nationalId: "",
          engineeringMajor: "",
          educationSystem: "",
          gradYear: new Date().getFullYear(),
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, user]);

  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = memberSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof MemberFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof MemberFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const memberData: member = {
      id: formData.id || "",
      name: formData.name.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      committee: formData.committee,
      position: formData.position,
      nationalId: formData.nationalId.trim(),
      engineeringMajor: formData.engineeringMajor,
      educationSystem: formData.educationSystem,
      gradYear: formData.gradYear,
    };

    try {
      if (mode === "create") {
        await createUserMutation.mutateAsync(memberData);
      } else if (mode === "edit" && user) {
        await updateUserMutation.mutateAsync({
          userId: user.id,
          userData: memberData,
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save member:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title={mode === "create" ? "Add New Member" : "Edit Member"}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div id="member-form" className="flex flex-col gap-4 p-1">
        <div className="space-y-1">
            <InputField
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            placeholder="Enter full name"
            />
            {errors.name && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.name}
            </p>
            )}
        </div>

        <div className="space-y-1">
            <InputField
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter email address"
            />
            {errors.email && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.email}
            </p>
            )}
        </div>

        <div className="space-y-1">
            <InputField
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Phone Number"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
            placeholder="01xxxxxxxxx"
            />
            {errors.phoneNumber && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.phoneNumber}
            </p>
            )}
        </div>
        
        <div className="space-y-1">
            <InputField
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="National ID"
            id="nationalId"
            value={formData.nationalId}
            onChange={(e) => handleInputChange("nationalId", e.target.value)}
            error={errors.nationalId}
            placeholder="Enter 16-digit national ID"
            />
            {errors.nationalId && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.nationalId}
            </p>
            )}
        </div>
        
        <div className="space-y-1">
            <NumberField
                labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
                label="Graduation Year"
                value={formData.gradYear.toString()}
                onChange={(value) => handleInputChange("gradYear", typeof value === "number" ? value.toString() : value)}
                error={errors.gradYear}
                placeholder="Enter graduation year"
            />
            {errors.gradYear && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.gradYear}
            </p>
            )}
        </div>
        
        <div className="space-y-1">
            <DropdownMenu
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Committee"
            id="committee"
            value={formData.committee}
            onChange={(value) => handleInputChange("committee", value)}
            options={COMMITTEES_OPTIONS}
            error={errors.committee}
            disabled={isLoading}
            placeholder="Select committee"
            />
            {errors.committee && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.committee}
            </p>
            )}
        </div>
            
        <div className="space-y-1">
            <DropdownMenu
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Position"
            id="position"
            value={formData.position || ""}
            onChange={(value) => handleInputChange("position", value)}
            options={POSITIONS}
            error={errors.position}
            disabled={isLoading}
            placeholder="Select position"
            />
            {errors.position && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.position}
            </p>
            )}
        </div>
        
        <div className="space-y-1">
            <DropdownMenu
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Engineering Major"
            id="engineeringMajor"
            value={formData.engineeringMajor}
            onChange={(value) => handleInputChange("engineeringMajor", value)}
            options={DEPARTMENT_LIST}
            error={errors.engineeringMajor}
            disabled={isLoading}
            placeholder="Select engineering major"
            />
            {errors.engineeringMajor && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.engineeringMajor}
            </p>
            )}
        </div>
        
        <div className="space-y-1">
            <DropdownMenu
            labelClassName="text-contrast text-[14px] md:text-[14px] lg:text-[15px] mb-1"
            label="Education System"
            id="educationSystem"
            value={formData.educationSystem}
            onChange={(value) => handleInputChange("educationSystem", value)}
            options={EDUCATION_SYSTEMS}
            error={errors.educationSystem}
            disabled={isLoading}
            placeholder="Select education system"
            />
            {errors.educationSystem && (
            <p className="text-primary text-[12px] lg:text-[13px] font-medium">
                {errors.educationSystem}
            </p>
            )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            buttonText="Cancel"
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.FULL}
            onClick={handleClose}
            disabled={isLoading}
          />
          <Button
            buttonText={mode === "create" ? "Add Member" : "Save Changes"}
            type={ButtonTypes.PRIMARY}
            width={ButtonWidths.FULL}
            disabled={isLoading}
            loading={isLoading}
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UserManageModal;
