import { fetchConfig, appFetch } from "./appFetch";

export const getProducts = (state, onSuccess, onErrors) => {
  console.log(`/product/?page=${state.page}&size=${state.size}`);
  appFetch(
    `/product/?page=${state.page}&size=${state.size}`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const addProduct = (
  product,
  onSuccess,
  onErrors,
  reauthenticationCallback,
) => {
  appFetch(`/product/add`, fetchConfig("POST", product), onSuccess, onErrors);
};

export const getAllCategories = (onSuccess, onErrors) => {
  appFetch(`/product/allCategories`, fetchConfig("GET"), onSuccess, onErrors);
};

export const getProductById = (productId, onSuccess, onErrors) => {
  appFetch(
    `/product/${productId}/details`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const getProductsByUserId = (userId, onSuccess, onErrors) => {
  appFetch(
    `/product/${userId}/productList`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const addToFavorites = (productId, onSuccess, onErrors) => {
  appFetch(
    `/product/${productId}/addFavorite`,
    fetchConfig("POST"),
    onSuccess,
    onErrors,
  );
};

export const removeFromFavorites = (productId, onSuccess, onErrors) => {
  appFetch(
    `/product/${productId}/removeFavorite`,
    fetchConfig("DELETE"),
    onSuccess,
    onErrors,
  );
};

export const getFavourites = () => {
  return new Promise((resolve, reject) => {
    appFetch(
      `/product/favorites`,
      fetchConfig("GET"),
      (data) => resolve(data), // Callback para el éxito
      (error) => reject(error), // Callback para el error
    );
  });
};
