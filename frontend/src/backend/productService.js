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

export const addProduct = async (
  product,
  onSuccess,
  onErrors,
  reauthenticationCallback,
) => {
  appFetch(`/product/add`, fetchConfig("POST", product), onSuccess, onErrors);
};

export const updateProduct = async (
  productId,
  productDto,
  onSuccess,
  onErrors,
) => {
  appFetch(
    `/product/${Number(productId)}/update`,
    fetchConfig("PUT", productDto),
    onSuccess,
    onErrors,
  );
};

export const deleteProduct = async (productId, onSuccess, onErrors) => {
  appFetch(
    `/product/${productId}/delete`,
    fetchConfig("DELETE"),
    onSuccess,
    onErrors,
  );
};

export const getAllCategories = (onSuccess, onErrors) => {
  appFetch(`/product/allCategories`, fetchConfig("GET"), onSuccess, onErrors);
};

export const getProductById = async (productId, onSuccess, onErrors) => {
  appFetch(
    `/product/${productId}/details`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const getProductsByUserId = async (
  userId,
  state,
  onSuccess,
  onErrors,
) => {
  appFetch(
    `/product/${userId}/productList?page=${state.page}&size=${state.size}`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const changeProductImages = async (
  productId,
  images,
  onSuccess,
  onErrors,
) => {
  appFetch(
    `/product/${productId}/changeImages`,
    fetchConfig("PUT", images),
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

export const getProductsByPurchaseId = async (
  purchaseId,
  onSuccess,
  onErrors,
) => {
  appFetch(
    `/purchase/${purchaseId}/getProducts`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};
