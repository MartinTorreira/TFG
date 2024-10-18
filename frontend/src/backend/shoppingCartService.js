import { appFetch, fetchConfig } from "./appFetch";

export const getCartProducts = async (onSuccess, onErrors) => {
  appFetch(
    `/shoppingCart/getProducts`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const addProductToCart = (productId, quantity, onSuccess, onErrors) => {
  appFetch(
    `/shoppingCart/addProduct`,
    fetchConfig("POST", {
      productId: Number(productId),
      quantity: Number(quantity),
    }),
    onSuccess,
    onErrors,
  );
};

export const deleteItemFromCart = (cartItemId, onSuccess, onErrors) => {
  appFetch(
    `/shoppingCart/${cartItemId}/removeItem`,
    fetchConfig("DELETE"),
    onSuccess,
    onErrors,
  );
};

export const updateItemQuantity = async (id, quantity, onSuccess, onErrors) => {
  console.log("cartItemId", id, "newQuantity", quantity);
  appFetch(
    `/shoppingCart/updateQuantity`,
    fetchConfig("PUT", { id, quantity }),
    onSuccess,
    onErrors,
  );
};

export const getItemByProductId = async (productId, onSuccess, onErrors) => {
  appFetch(
    `/shoppingCart/${productId}/getItemId`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

export const getProductByItemId = async (itemId, onSuccess, onErrors) => {
  appFetch(
    `/shoppingCart/${itemId}/getProduct`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};
