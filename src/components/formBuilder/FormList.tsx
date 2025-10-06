import type { form } from "@/types/form";
import { SearchField } from "tccd-ui";
import { useState, useEffect } from "react";
import FormTable from "./FormTable";
import FormCardView from "./FormCardView";

interface FormsTableProps {
    Forms: form[];
}

const FormList = ({ Forms }: FormsTableProps) => {
    const [searchKey, setSearchKey] = useState<string>("");
    const [displayedForms, setDisplayedForms] = useState<form[]>(Forms);
    
    useEffect(() => {
        if (searchKey.trim() === "") {
            setDisplayedForms(Forms);
        } else {
            const lowerSearchKey = searchKey.toLowerCase();
            const filtered = Forms.filter((form) =>
                form.title.toLowerCase().includes(lowerSearchKey)
            );
            setDisplayedForms(filtered);
        }
    }, [searchKey, Forms]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
      <div className="p-4 border-b border-dashboard-border flex md:flex-row flex-col gap-2 md:gap-4 items-center">
        <h3 className="text-lg font-bold text-[#727477]">
          Forms {Forms?.length ? `(${Forms.length})` : ""}
        </h3>
        <SearchField
          placeholder="Search forms..."
          value={searchKey}
          onChange={(value) => setSearchKey(value)}
        />
      </div>
      {/* Desktop Table View */}
      <FormTable
        forms={displayedForms}
      />

      {/* Mobile Card View */}
      <FormCardView
        forms={displayedForms}
      />
    </div>
  );
};

export default FormList;
