import { create } from 'zustand';
import { createOffer, getOfferById } from "../../backend/offerService";

const useOfferStore = create((set) => ({
  offers: [],
  setOffer: (offer) => set((state) => ({
    offers: [...state.offers, offer]
  })),
  createAndSendOffer: async (userId, offer, onSuccess, onErrors) => {
    try {
      const newOffer = await new Promise((resolve, reject) => {
        createOffer(userId, offer, resolve, reject);
      });
      set((state) => ({
        offers: [...state.offers, newOffer]
      }));
      onSuccess(newOffer);
    } catch (error) {
      onErrors(error);
    }
  },
  getOfferDetails: async (offerId, onSuccess, onErrors) => {
    try {
      const offer = await new Promise((resolve, reject) => {
        getOfferById(offerId, resolve, reject);
      });
      onSuccess(offer);
    } catch (error) {
      onErrors(error);
    }
  }
}));

export default useOfferStore;