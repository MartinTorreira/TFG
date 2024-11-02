import { create } from "zustand";
import { getSellerId, getUserById } from "../../backend/userService";

const useRatingsStore = create((set) => ({
  ratings: {},
  setRating: (purchaseId, rating) =>
    set((state) => ({
      ratings: { ...state.ratings, [purchaseId]: rating },
    })),
  fetchRatings: async (purchases) => {
    const ratings = {};
    for (const purchase of purchases) {
      await getSellerId(purchase.id, (sellerId) => {
        getUserById(sellerId, (user) => {
          ratings[purchase.id] = user.rate;
        });
      });
    }
    set({ ratings });
  },
}));

export default useRatingsStore;