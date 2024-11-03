import { create } from "zustand";
import { getSellerId, getUserById, rateUser } from "../../backend/userService";

const useRatingStore = create((set) => ({
  ratings: {},
  setRating: (userId, rate) => {
    rateUser(
      userId,
      rate,
      (user) => {
        set((state) => ({
          ratings: { ...state.ratings, [userId]: user.rate },
        }));
      },
      () => {
        console.error("Error rating user");
      }
    );
  },
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

export default useRatingStore;