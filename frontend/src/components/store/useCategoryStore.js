import { getAllCategories } from "../../backend/productService";
import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: () => {
    set({ loading: true, error: null });
    getAllCategories(
      (data) => set({ categories: data, loading: false }),
      (error) => set({ error, loading: false }),
    );
  },
}));
