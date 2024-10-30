import { fetchConfig, appFetch } from "./appFetch";

export const createOffer = async (userId, offerDto, onSuccess, onErrors) => {
    appFetch(`/offer/create?sellerId=${userId}`, fetchConfig("POST", offerDto), onSuccess, onErrors);
}

export const getOfferById = async (offerId, onSuccess, onErrors) => {
    appFetch(`/offer/${offerId}/get`, fetchConfig("GET"), onSuccess, onErrors);
}