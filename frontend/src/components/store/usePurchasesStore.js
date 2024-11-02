import { create } from "zustand";
import {
  getUserPurchases,
  changePurchaseStatus,
  deletePurchase as deletePurchaseService,
} from "../../backend/paymentService.js";

const usePurchasesStore = create((set, get) => ({
  purchases: [],

  setPurchases: (purchases) => set({ purchases }),

  loadPurchases: async (userId) => {
    try {
      getUserPurchases(
        userId,
        { page: 0, size: 10 },
        (data) => {
          set({ purchases: data.content });
          console.log("data.content" + data.content.captureId);
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error(error);
    }
  },

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

}));

export default usePurchasesStore;
