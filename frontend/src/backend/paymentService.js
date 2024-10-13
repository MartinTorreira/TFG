import { appFetch, fetchConfig } from "./appFetch";

export const createOrder = async (buyerId, sellerId, productId, amount) => {
  const body = {
    buyerId,
    sellerId,
    productIds: [productId],
    quantities: [1],
    amount,
    currency: "EUR",
    paymentMethod: "paypal",
  };

  return new Promise((resolve, reject) => {
    appFetch("/purchase/create", fetchConfig("POST", body), resolve, reject);
  });
};

export const executeOrder = async (orderId, userId) => {
  return new Promise((resolve, reject) => {
    appFetch(
      `/purchase/execute?orderId=${orderId}`,
      fetchConfig("POST", null, { userId }),
      resolve,
      reject,
    );
  });
};

export const getPurchaseByProductId = async (
  productId,
  onSuccess,
  onErrors,
) => {
  return appFetch(
    `/purchase/${productId}`,
    fetchConfig("GET"),
    onSuccess,
    onErrors,
  );
};

// export const getProductsByUserId = (userId, onSuccess, onErrors) => {
//   appFetch(
//     `/product/${userId}/productList`,
//     fetchConfig("GET"),
//     onSuccess,
//     onErrors,
//   );
// };
