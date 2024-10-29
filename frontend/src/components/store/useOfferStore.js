import {create} from "zustand";

const useOfferStore = create((set) => ({
  offer: null,
  setOffer: (offer) => set({ offer }),
}));

export default useOfferStore;