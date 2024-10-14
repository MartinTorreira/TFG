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
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error(error);
    }
  },

  // removePurchase: (id) =>
  //   set((state) => ({
  //     purchases: state.purchases.filter((item) => item.productDto.id !== id),
  //   })),

  addPurchase: (purchase) =>
    set((state) => {
      const newPurchases = [...state.purchases, purchase];
      return { purchases: newPurchases };
    }),
}));

export default usePurchasesStore;
