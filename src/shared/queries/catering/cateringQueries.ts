import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cateringApiInstance } from "./cateringApi";
import type { CateringItem } from "@/shared/types/catering";

export const cateringKeys = {
  all: ["catering"] as const,
  eventCateringItems: (eventId: string) => [...cateringKeys.all, "event", eventId] as const,
};

export const useCateringItems = () => {
  return useQuery({
    queryKey: cateringKeys.all,
    queryFn: () => cateringApiInstance.fetchCateringItems(),
  });
}

export const useAddCateringItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemData: Omit<CateringItem, "id" | "quantity">) => cateringApiInstance.addCateringItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cateringKeys.all });
    }
  });
}
  
export const useUpdateCateringItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, itemData }: { itemId: string; itemData: Omit<CateringItem, "id" | "quantity"> }) => cateringApiInstance.updateCateringItem(itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cateringKeys.all });
    }
  });
}

export const useEventCateringItems = (eventId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: cateringKeys.eventCateringItems(eventId),
    queryFn: () => cateringApiInstance.fetchEventCateringItems(eventId),
    enabled: !!eventId && enabled,
  });
}

export const useEditCateringAllocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, memberId, cateringItemId, quantity }: { eventId: string; memberId: string; cateringItemId: string; quantity: number }) => cateringApiInstance.editCateringAllocation(eventId, memberId, cateringItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cateringKeys.all });
    }
  });
}

export const useBulkAllocateCateringItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({eventId, memberIds, items }: { eventId: string; memberIds: string[]; items: {cateringItemId: string; amount: number}[] }) => cateringApiInstance.bulkAllocateCateringItems(eventId, memberIds, items),
    onSuccess: () => {
      // Invalidate all event catering items queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: cateringKeys.all });
    }
  });
}