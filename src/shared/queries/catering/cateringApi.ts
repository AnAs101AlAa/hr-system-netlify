import { systemApi } from "../axiosInstance";
import type { CateringItem, AllocatedCateringItem } from "@/shared/types/catering";

const CATERING_API_URL = "/v1/catering/";

class cateringApi {
  async fetchCateringItems(): Promise<CateringItem[]> {
    const response = await systemApi.get(`${CATERING_API_URL}items`);
    return response.data.data;
  }

  async addCateringItem(itemData: Omit<CateringItem, "id" | "quantity">): Promise<CateringItem> {
    const response = await systemApi.post(
      CATERING_API_URL + `items/`,
      itemData
    );
    return response.data.data;
  }

  async updateCateringItem(itemId: string, itemData: Omit<CateringItem, "id" | "quantity">): Promise<CateringItem> {
    const response = await systemApi.put(
      CATERING_API_URL + `items/${itemId}`,
      itemData
    );
    return response.data.data;
  }

  async fetchEventCateringItems(id: string, memberId?: string): Promise<AllocatedCateringItem[]> {
    const response = await systemApi.get(`${CATERING_API_URL}allocations/Events/${id}` + (memberId ? `?memberId=${memberId}` : ''));
    return response.data.data;
  }

  async editCateringAllocation(eventId: string, memberId: string, cateringItemId: string, quantity: number): Promise<void> {
    const response = await systemApi.put(
      CATERING_API_URL + `allocations/`,
      { eventId, memberId, cateringItemId, quantity }
    );
    return response.data.data;
  }
  
  async bulkAllocateCateringItems(eventId: string, memberIds: string[], items: {cateringItemId: string, amount: number}[]): Promise<void> {    
    const response = await systemApi.put(
      CATERING_API_URL + `allocations/bulk`,
      { 
        eventId,
        memberIds,
        items
      },
      { timeout: 600000 } // 10 minutes timeout
    );
    return response.data.data;
  }

  async bulkDeleteCateringAllocations(eventId: string, memberIds: string[], cateringItemIds: string[]): Promise<void> {    
    const response = await systemApi.delete(
      CATERING_API_URL + `allocations/bulk`,
      {
        data: {
          eventId,
          memberIds,
          cateringItemIds
        },
        timeout: 600000 // 10 minutes timeout
      }
    );
    return response.data.data;
  }

  async consumeCateringItems (eventId: string, memberId: string, items: {cateringItemId: string, quantity: number}[]): Promise<void> {
    const response = await systemApi.post(
      CATERING_API_URL + `consume/bulk`,
      { eventId, memberId, items }
    );
    return response.data.data;
  }

}
// Export a singleton instance for use across the application
export const cateringApiInstance = new cateringApi();
