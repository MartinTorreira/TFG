import { create } from "zustand";
import { getUserSales } from "../../backend/paymentService.js";

const useSalesStore = create((set) => ({
  sales: [],

  setSales: (sales) => set({ sales }),

  loadSales: async (userId) => {
    try {
      getUserSales(
        userId,
        { page: 0, size: 10 },
        (data) => {
          set({ sales: data.content });
        },
        (errors) => {
          console.log(errors);
        }
      );
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  },

  clearSales: () => set({ sales: [] }),
}));

export default useSalesStore;
