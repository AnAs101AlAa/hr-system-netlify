import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button, SearchField } from "tccd-ui";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import type { RootState } from "@/shared/redux/store/store";
import type {
  Company,
  CompanyCateringAllocation,
} from "@/shared/types/company";
import {
  useCompanyCateringItems,
  useDeleteCompany,
  useBulkSendCompanyCateringAllocationsEmail,
} from "@/shared/queries/companies";
import EditCompanyCateringModal from "./EditCompanyCateringModal";
import EditCompanyDataModal from "./EditCompanyDataModal";

interface CompaniesDistributionListProps {
  companies: Company[];
  companyCateringData: CompanyCateringAllocation[];
  eventId: string;
}

interface CompanyDistributionRow {
  id: string;
  companyId: string;
  companyName: string;
  [itemId: string]: string;
}

const CompaniesDistributionList = ({
  companies,
  companyCateringData,
  eventId,
}: CompaniesDistributionListProps) => {
  const [searchKey, setSearchKey] = useState("");
  const [displayedRows, setDisplayedRows] = useState<CompanyDistributionRow[]>(
    []
  );
  const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingCompanyName, setEditingCompanyName] = useState<string | null>(
    null
  );
  const [isEditCompanyDataOpen, setIsEditCompanyDataOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles.includes("Admin") || false;

  const { data: allItems } = useCompanyCateringItems();
  const deleteCompanyMutation = useDeleteCompany();
  const sendEmailMutation = useBulkSendCompanyCateringAllocationsEmail();

  const { rows, itemColumns } = useMemo(() => {
    const itemsMap = new Map<string, { id: string; name: string }>();

    (allItems || []).forEach((item) => {
      itemsMap.set(item.id, { id: item.id, name: item.name });
    });

    companyCateringData.forEach((allocation) => {
      if (!itemsMap.has(allocation.cateringItemId)) {
        itemsMap.set(allocation.cateringItemId, {
          id: allocation.cateringItemId,
          name: allocation.itemName,
        });
      }
    });

    const allocationMap = new Map<string, Map<string, string>>();

    companyCateringData.forEach((allocation) => {
      if (!allocationMap.has(allocation.companyId)) {
        allocationMap.set(allocation.companyId, new Map());
      }

      allocationMap
        .get(allocation.companyId)
        ?.set(
          allocation.cateringItemId,
          `${allocation.amount} - ${allocation.remainingAmount}`
        );
    });

    const processedRows: CompanyDistributionRow[] = companies.map((company) => {
      const row: CompanyDistributionRow = {
        id: company.id,
        companyId: company.id,
        companyName: company.name,
      };

      itemsMap.forEach(({ id }) => {
        const formattedValue = allocationMap.get(company.id)?.get(id);
        row[id] = formattedValue || "N/A";
      });

      return row;
    });

    return {
      rows: processedRows,
      itemColumns: Array.from(itemsMap.values()),
    };
  }, [companies, companyCateringData, allItems]);

  useEffect(() => {
    if (!searchKey.trim()) {
      setDisplayedRows(rows);
      return;
    }

    const query = searchKey.toLowerCase();
    setDisplayedRows(
      rows.filter((row) => row.companyName.toLowerCase().includes(query))
    );
  }, [rows, searchKey]);

  const columns = useMemo(() => {
    return [
      {
        key: "companyName" as const,
        label: "Company Name",
        formatter: (value: string) => value || "N/A",
      },
      ...itemColumns.map((item) => ({
        key: item.id as keyof CompanyDistributionRow,
        label: item.name,
        formatter: (value: string) => value || "N/A",
      })),
    ];
  }, [itemColumns]);

  const handleDeleteCompany = async (company: CompanyDistributionRow) => {
    try {
      await deleteCompanyMutation.mutateAsync({
        eventId,
        companyId: company.companyId,
      });
      toast.success("Company deleted successfully");
    } catch {
      toast.error("Failed to delete company");
    }
  };

  const handleSendEmail = async (companyId: string) => {
    try {
      await sendEmailMutation.mutateAsync({
        eventId,
        companyIds: [companyId],
      });
      toast.success("Email sent successfully");
    } catch {
      toast.error("Failed to send email");
    }
  };

  const renderActionButton = (
    row: CompanyDistributionRow,
    triggerDelete: (id: string) => void
  ) => {
    const companyRecord =
      companies.find((company) => company.id === row.companyId) || null;

    return (
      <>
        <Button
          buttonText="Edit"
          onClick={() => {
            setEditingCompanyId(row.companyId);
            setEditingCompanyName(row.companyName);
            setIsEditAllocationOpen(true);
          }}
          type="secondary"
          width="auto"
        />

        {isAdmin && (
          <Button
            buttonText="Edit Company Data"
            onClick={() => {
              setEditingCompany(companyRecord);
              setIsEditCompanyDataOpen(true);
            }}
            type="tertiary"
            width="auto"
          />
        )}

        {isAdmin && (
          <Button
            buttonText="Delete Company"
            onClick={() => triggerDelete(row.id)}
            type="danger"
            width="auto"
          />
        )}

        {isAdmin && (
          <Button
            buttonText="Send Email"
            onClick={() => handleSendEmail(row.companyId)}
            type="primary"
            width="auto"
            disabled={sendEmailMutation.isPending}
          />
        )}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-surface-glass-bg rounded-b-lg shadow-sm border border-dashboard-card-border border-t-0 overflow-x-auto -mt-1">
      <div className="p-4 border-b border-dashboard-border flex md:flex-row flex-col gap-2 md:gap-4 items-center">
        <h3 className="text-lg font-bold text-text-muted-foreground">
          Companies {rows.length ? `(${rows.length})` : ""}
        </h3>
        <SearchField
          placeholder="Search companies..."
          value={searchKey}
          onChange={(value) => setSearchKey(value)}
        />
      </div>

      {displayedRows.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No companies found.
        </div>
      ) : (
        <>
          <Table
            items={displayedRows}
            columns={columns}
            emptyMessage="No company catering distributions found"
            renderActions={renderActionButton}
            modalTitle="Delete Company"
            modalSubTitle="Are you sure you want to delete this company? This action cannot be undone."
            confirmationAction={handleDeleteCompany}
            isSubmitting={deleteCompanyMutation.isPending}
          />

          <CardView
            items={displayedRows}
            titleKey="companyName"
            renderedFields={itemColumns.map((item) => ({
              key: item.id,
              label: item.name,
              formatter: (value: string) => value || "N/A",
            }))}
            renderButtons={renderActionButton}
            modalTitle="Delete Company"
            modalSubTitle="Are you sure you want to delete this company? This action cannot be undone."
            confirmationAction={handleDeleteCompany}
            isSubmitting={deleteCompanyMutation.isPending}
          />
        </>
      )}

      {editingCompanyId && editingCompanyName && (
        <EditCompanyCateringModal
          isOpen={isEditAllocationOpen}
          onClose={() => setIsEditAllocationOpen(false)}
          companyId={editingCompanyId}
          companyName={editingCompanyName}
          eventId={eventId}
          companyAllocations={companyCateringData.filter(
            (item) => item.companyId === editingCompanyId
          )}
        />
      )}

      <EditCompanyDataModal
        isOpen={isEditCompanyDataOpen}
        onClose={() => setIsEditCompanyDataOpen(false)}
        eventId={eventId}
        company={editingCompany}
      />
    </div>
  );
};

export default CompaniesDistributionList;
