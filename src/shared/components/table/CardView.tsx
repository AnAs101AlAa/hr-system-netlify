import { useEffect, useState } from "react";
import ConfirmActionModal from "@/features/judgingSystem/components/ConfirmActionModal";

interface CardViewProps<T> {
  items: T[];
  titleKey: keyof T;
  renderedFields: { label: string; key: keyof T; formatter?: (value: any) => string }[];
  modalTitle: string;
  modalSubTitle: string;
  isSubmitting: boolean;
  confirmationAction: (item: T) => void;
  renderButtons?: (item: T, index: number) => React.ReactNode;
}

const CardView = <T extends { id?: string }>({ 
  items, 
  titleKey,
  renderedFields,
  modalTitle, 
  modalSubTitle, 
  confirmationAction,
  isSubmitting,
  renderButtons,
}: CardViewProps<T>) => {
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [displayedItems, setDisplayedItems] = useState<T[]>(items);
  
  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  return (
    <div className="lg:hidden divide-y divide-gray-100">
      <ConfirmActionModal 
        item={items.find(item => item.id === showDeleteModal) as T}
        title={modalTitle} 
        subtitle={modalSubTitle} 
        isOpen={!!showDeleteModal} 
        onClose={() => setShowDeleteModal("")} 
        onSubmit={(target: T) => confirmationAction(target)} 
        isSubmitting={isSubmitting}
      />
        
      {displayedItems && displayedItems.length > 0 ? (
        displayedItems.map((item, index) => (
          <div key={item.id || index} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-contrast text-[18px] md:text-[20px]">
                  {String(item[titleKey]) || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              {renderedFields.map((field, idx) => {
                const value = item[field.key];
                const displayValue = field.formatter 
                  ? field.formatter(value) 
                  : String(value || "N/A");
                
                return (
                  <div key={idx}>
                    <span className="font-medium text-dashboard-heading">
                      {field.label}:
                    </span>
                    <p className="text-dashboard-card-text">
                      {displayValue}
                    </p>
                  </div>
                );
              })}
            </div>

            {renderButtons && (
              <div className="mt-4 flex justify-center items-center gap-3">
                {renderButtons(item, index)}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="text-dashboard-description">
            <p className="text-lg font-medium">No items found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardView;