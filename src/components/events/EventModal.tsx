import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Button from "@/components/generics/Button";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import InputField from "@/components/generics/InputField";
import TextAreaField from "@/components/generics/TextAreaField";
import DatePicker from "@/components/generics/DatePicker";
import DropdownMenu from "@/components/generics/dropDownMenu";
import EVENT_TYPES from "@/constants/eventTypes";
import type { Event } from "@/types/event";
import { useAddEvent, useUpdateEvent } from "@/queries/events/eventQueries";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null; // null for create, Event for edit
  mode: "create" | "edit";
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  mode,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const addEventMutation = useAddEvent();
  const updateEventMutation = useUpdateEvent();

  const isLoading = addEventMutation.isPending || updateEventMutation.isPending;

  // Initialize form data when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && event) {
        setFormData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          type: event.type || "",
          startDate: event.startDate || "",
          endDate: event.endDate || "",
        });
      } else {
        // Reset form for create mode
        setFormData({
          title: "",
          description: "",
          location: "",
          type: "",
          startDate: "",
          endDate: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, event]);

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.type) {
      newErrors.type = "Event type is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const eventData: Omit<Event, "id"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      if (mode === "create") {
        await addEventMutation.mutateAsync(eventData);
      } else if (mode === "edit" && event) {
        await updateEventMutation.mutateAsync({
          eventId: event.id,
          eventData,
        });
      }
      onClose();
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Failed to save event:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          id="event-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <InputField
                label=""
                id="event-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <TextAreaField
                label=""
                id="event-description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter event description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <InputField
                label=""
                id="event-location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <DropdownMenu
                placeholder="Select event type"
                options={EVENT_TYPES}
                value={formData.type}
                onChange={(value) => handleInputChange("type", value)}
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <DatePicker
                  label=""
                  id="event-start-date"
                  value={formData.startDate}
                  onChange={(value) => handleInputChange("startDate", value)}
                  disabled={isLoading}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <DatePicker
                  label=""
                  id="event-end-date"
                  value={formData.endDate}
                  onChange={(value) => handleInputChange("endDate", value)}
                  disabled={isLoading}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            buttonText="Cancel"
            onClick={handleClose}
            type={ButtonTypes.GHOST}
            width={ButtonWidths.AUTO}
            disabled={isLoading}
          />
          <Button
            buttonText={mode === "create" ? "Create Event" : "Save Changes"}
            onClick={() => {
              const form = document.getElementById(
                "event-form"
              ) as HTMLFormElement;
              if (form) {
                form.requestSubmit();
              }
            }}
            type={ButtonTypes.PRIMARY}
            width={ButtonWidths.AUTO}
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
