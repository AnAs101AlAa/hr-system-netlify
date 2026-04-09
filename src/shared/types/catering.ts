export interface CateringItem {
    id: string;
    name: string;
    quantity: number;
}

export interface CompanyEntity {
    id: string;
    name: string;
    employeeCount: number;
    cateringItems: CateringItem[];
}