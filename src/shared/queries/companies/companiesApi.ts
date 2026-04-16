import type { CateringItem } from "@/shared/types/catering";
import type {
  Company,
  CompanyAllocationItemInput,
  CompanyCateringAllocation,
  CompanyPayload,
} from "@/shared/types/company";
import { systemApi } from "../axiosInstance";

const COMPANY_API_URL = "/v1/Company";
const COMPANY_CATERING_API_URL = "/v1/CompanyCatering";
const CATERING_ITEMS_API_URL = "/v1/catering/items";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

class CompaniesApi {
  async fetchEventCompanies(): Promise<Company[]> {
    const response = await systemApi.get<ApiResponse<Company[]>>(COMPANY_API_URL);
    return response.data.data;
  }

  async fetchEventCompanyCatering(
    eventId: string,
    companyId?: string
  ): Promise<CompanyCateringAllocation[]> {
    const response = await systemApi.get<ApiResponse<CompanyCateringAllocation[]>>(
      `${COMPANY_CATERING_API_URL}/allocations/events/${eventId}`,
      {
        params: companyId ? { companyId } : undefined,
      }
    );

    return response.data.data;
  }

  async fetchCompanyCateringItems(): Promise<CateringItem[]> {
    const response = await systemApi.get(CATERING_ITEMS_API_URL);
    return response.data.data;
  }

  async addCompanyCateringItem(
    itemData: Omit<CateringItem, "id" | "quantity">
  ): Promise<CateringItem> {
    const response = await systemApi.post(CATERING_ITEMS_API_URL, itemData);
    return response.data.data;
  }

  async addCompany(payload: CompanyPayload): Promise<Company> {
    const response = await systemApi.post<ApiResponse<Company>>(
      COMPANY_API_URL,
      payload
    );
    return response.data.data;
  }

  async updateCompany(companyId: string, payload: CompanyPayload): Promise<Company> {
    const response = await systemApi.put<ApiResponse<Company>>(
      `${COMPANY_API_URL}/${companyId}`,
      payload
    );
    return response.data.data;
  }

  async deleteCompany(companyId: string): Promise<void> {
    await systemApi.delete(`${COMPANY_API_URL}/${companyId}`);
  }

  async bulkAllocateCompanyCateringItems(
    eventId: string,
    companyIds: string[],
    items: CompanyAllocationItemInput[]
  ): Promise<void> {
    await systemApi.put(`${COMPANY_CATERING_API_URL}/allocations/bulk`, {
      eventId,
      companyIds,
      items,
    });
  }

  async bulkDeleteCompanyCateringAllocations(
    eventId: string,
    companyIds: string[],
    cateringItemIds: string[]
  ): Promise<void> {
    await systemApi.delete(`${COMPANY_CATERING_API_URL}/allocations/bulk`, {
      data: {
        eventId,
        companyIds,
        cateringItemIds,
      },
    });
  }
}

export const companiesApiInstance = new CompaniesApi();
