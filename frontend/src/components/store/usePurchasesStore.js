// src/store/usePurchasesStore.js
import { create } from "zustand";
import { getUserPurchases } from "../../backend/paymentService.js";

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
        }
      );
    } catch (error) {
      console.error(error);
    }
  },

  addPurchase: (purchase) =>
    set((state) => ({
      purchases: [...state.purchases, purchase],
    })),


    updateCaptureId: (purchaseId, captureId) => {
      console.log("updateCaptureStore", purchaseId, captureId);
      set((state) => ({
        purchases: state.purchases.map((purchase) =>
          purchase.id === purchaseId
            ? { ...purchase, captureId: captureId }
            : purchase
        ),
      }));
    },
}));

export default usePurchasesStore;
