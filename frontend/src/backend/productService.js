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
