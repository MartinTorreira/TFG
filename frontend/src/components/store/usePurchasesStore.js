import { create } from "zustand";
import {
  getUserPurchases,
  changePurchaseStatus,
  deletePurchase as deletePurchaseService,
} from "../../backend/paymentService.js";

const usePurchasesStore = create((set, get) => ({
  purchases: [],
  page: 0,
  size: 7,
  totalPages: 0,

  setPurchases: (purchases) => set({ purchases }),

  loadPurchases: async (userId, page = 0, size = 7) => {
    try {
      getUserPurchases(
        userId,
        { page, size },
        (data) => {
          set({
            purchases: data.content,
            page: data.pageable.pageNumber,
            totalPages: data.totalPages,
          });
        },
        (errors) => {
          console.log(errors);
        }
      );
    } catch (error) {
      console.error("Error al cargar compras:", error);
    }
  },

  setPage: (page) => set((state) => {
    if (page >= 0 && page < state.totalPages) {
      return { page };
    }
    return state;
  }),

  addPurchase: (purchase) =>
    set((state) => ({
      purchases: [...state.purchases, purchase],
    })),

  updateCaptureId: (purchaseId, captureId, userId) => {
    set((state) => ({
      purchases: state.purchases.map((purchase) =>
        purchase.id === purchaseId
          ? { ...purchase, captureId: captureId }
          : purchase,
      ),
    }));
    get().loadPurchases(userId);
  },

  updatePurchaseStatus: async (purchaseId, purchaseStatus) => {
    try {
      await changePurchaseStatus(
        purchaseId,
        purchaseStatus,
        (updatedPurchase) => {
          set((state) => ({
            purchases: state.purchases.map((purchase) =>
              purchase.id === purchaseId
                ? {
                    ...purchase,
                    purchaseStatus: updatedPurchase.purchaseStatus,
                  }
                : purchase,
            ),
          }));
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error("Error updating purchase status:", error);
    }
  },

  deletePurchase: async (purchaseId) => {
    try {
      await deletePurchaseService(
        purchaseId,
        () => {
          set((state) => ({
            purchases: state.purchases.filter(
              (purchase) => purchase.id !== purchaseId,
            ),
          }));
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  },

  clearPurchases: () => set({ purchases: [] }),
}));

export default usePurchasesStore;