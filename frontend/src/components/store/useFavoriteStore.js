import { create } from "zustand";
import { getFavourites } from "../../backend/productService.js";

const useFavoriteStore = create((set, get) => ({
  favorites: [],

  setFavorites: (favorites) => set({ favorites }),

  loadFavorites: async () => {
    try {
      const response = await getFavourites();

      if (response && response.content) {
        set({ favorites: response.content });
      } else {
        console.warn("No content found in the response.");
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  },

  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((item) => item.productDto.id !== id),
    })),

  addFavorite: (favorite) =>
    set((state) => {
      const newFavorites = [...state.favorites, favorite];
      return { favorites: newFavorites };
    }),

  isFavorite: (productId) => {
    const state = get();
    return state.favorites.some(
      (favorite) => favorite.productDto.id === productId,
    );
  },
}));

export default useFavoriteStore;
