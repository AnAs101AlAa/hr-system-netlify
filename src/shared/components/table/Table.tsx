import { useEffect, useState } from "react";

interface TableProps<T> {
  items: T[];
  columns: { label: string; key: keyof T; width?: string; formatter?: (value: any) => string }[];
  renderActions?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

const Table = <T extends { id?: string }>({
  items,
  columns,
  renderActions,
  emptyMessage = "No items found"
}: TableProps<T>) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>(items);
  
  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);
  
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th 
                key={idx}
                className={`px-4 py-3 text-left text-sm font-medium text-[#555C6C] ${column.width || ''}`}
              >
                {column.label}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {displayedItems && displayedItems.length > 0 ? (
            displayedItems.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, idx) => {
                  const value = item[column.key];
                  const displayValue = column.formatter 
                    ? column.formatter(value) 
                    : String(value || "N/A");
                  
                  return (
                    <td key={idx} className="px-4 py-3">
                      <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                        {displayValue}
                      </div>
                    </td>
                  );
                })}
                {renderActions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {renderActions(item, index)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-8 text-center">
                <div className="text-dashboard-description">
                  <p className="text-lg font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;