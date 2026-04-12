import { useState, useEffect, useMemo } from "react";
import { Modal, NumberField, Button } from "tccd-ui";
import type { AllocatedCateringItem } from "@/shared/types/catering";
import { useBulkAllocateCateringItems, useCateringItems } from "@/shared/queries/catering";
import toast from "react-hot-toast";

interface EditMemberCateringModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  eventId: string;
  memberAllocations: AllocatedCateringItem[];
}

interface AllocationFormData {
  [cateringItemId: string]: number;
}

const EditMemberCateringModal = ({
  isOpen,
  onClose,
  memberId,
  memberName,
  eventId,
  memberAllocations,
}: EditMemberCateringModalProps) => {
  const [formData, setFormData] = useState<AllocationFormData>({});
  const { data: allCateringItems } = useCateringItems();
  const bulkAllocateMutation = useBulkAllocateCateringItems();

  // Initialize form with current allocations
  useEffect(() => {
    if (isOpen && memberAllocations.length > 0) {
      const initialData: AllocationFormData = {};
      memberAllocations.forEach((allocation) => {
        initialData[allocation.cateringItemId] = allocation.amount;
      });
      setFormData(initialData);
    } else if (isOpen && allCateringItems && allCateringItems.length > 0) {
      // Initialize empty form for all items if no allocations
      const initialData: AllocationFormData = {};
      allCateringItems.forEach((item) => {
        initialData[item.id] = 0;
      });
      setFormData(initialData);
    }
  }, [isOpen, memberId, memberAllocations, allCateringItems]);

  // Get items that are allocated to this member (or all items if none allocated)
  const itemsToDisplay = useMemo(() => {
    if (!allCateringItems) return [];
    
    // Show all items, but pre-fill quantities for items already allocated to this member
    return allCateringItems.map((item) => {
      const allocation = memberAllocations.find(
        (a) => a.cateringItemId === item.id
      );
      return {
        ...item,
        currentAmount: allocation?.amount || 0,
      };
    });
  }, [allCateringItems, memberAllocations]);

  const handleQuantityChange = (itemId: string, value: string | number) => {
    const numValue = Math.max(0, parseInt(String(value)) || 0);
    setFormData((prev) => ({
      ...prev,
      [itemId]: numValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Filter out items with 0 quantity
      const items = Object.entries(formData)
        .filter(([, amount]) => amount > 0)
        .map(([cateringItemId, amount]) => ({
          cateringItemId,
          amount,
        }));

      await bulkAllocateMutation.mutateAsync({
        eventId,
        memberIds: [memberId],
        items,
      });

      toast.success(`Catering allocation for ${memberName} updated successfully`);
      onClose();
    } catch (error) {
      toast.error("Failed to update catering allocation");
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title={`Edit Catering for ${memberName}`}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-4 p-1 max-h-96 overflow-y-auto">
        {itemsToDisplay.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No catering items available
          </div>
        ) : (
          <div className="space-y-4">
            {itemsToDisplay.map((item) => (
              <div
                key={item.id}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex flex-col gap-2 mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  )}
                </div>
                <NumberField
                  label="Quantity"
                  value={String(formData[item.id] !== undefined ? formData[item.id] : item.currentAmount)}
                  onChange={(value) =>
                    handleQuantityChange(item.id, value)
                  }
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-2 mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
          <Button
            onClick={handleClose}
            buttonText="Cancel"
            type="secondary"
            width="auto"
          />
          <Button
            onClick={handleSubmit}
            buttonText={
              bulkAllocateMutation.isPending ? "Updating..." : "Update"
            }
            type="primary"
            width="auto"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditMemberCateringModal;
