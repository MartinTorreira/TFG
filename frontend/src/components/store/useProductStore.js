import { create } from "zustand";
import { getProducts } from "../../backend/productService";
import { getProductById } from "../../backend/productService";

export const useProductStore = create((set, get) => ({
  price: "",
  category: "all",
  query: "",
  products: [],
  filteredProducts: [],

  setPriceFilter: (price) => set({ price }),
  setCategoryFilter: (category) => set({ category }),
  setFilteredQuery: (query) => set({ query }),
  setProducts: (products) => set({ products }),
  setFilteredProducts: (filteredProducts) => set({ filteredProducts }),

  getFilters: () => ({
    price: get().price,
    category: get().category,
  }),

  fetchProducts: async () => {
    try {
      getProducts(
        { page: 0, size: 10 },
        (data) => {
          set({ products: data.content });
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error(error);
    }
  },

  getProductById: (id) => {
    const { products } = get();

    if (products.length === 0) {
      get().getProductById(id);
      return null;
    }

    return products.find((product) => product.id === id);
  },
}));
