import { create } from "zustand";
import { getUserSales } from "../../backend/paymentService.js";

const useSalesStore = create((set) => ({
  sales: [],
  page: 0,
  size: 10,
  totalPages: 0,

  setSales: (sales) => set({ sales }),

  loadSales: async (userId, page = 0, size = 10) => {
    try {
      getUserSales(
        userId,
        { page, size },
        (data) => {
          set({ 
            sales: data.content,
            page: data.pageable.pageNumber,
            totalPages: data.totalPages
          });
        },
        (errors) => {
          console.log(errors);
        }
      );
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  },

  setPage: (page) => set((state) => {
    if (page >= 0 && page < state.totalPages) {
      return { page };
    }
    return state;
  }),

  clearSales: () => set({ sales: [] }),
}));

export default useSalesStore;