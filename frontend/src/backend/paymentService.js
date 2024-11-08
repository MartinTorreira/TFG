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
      reject
    );
  });
};

export const getPurchaseByProductId = async (
  productId,
  onSuccess,
  onErrors
) => {
  return appFetch(
    `/purchase/${productId}`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
};

export const getUserPurchases = async (userId, state, onSuccess, onErrors) => {
  return appFetch(
    `/purchase/${userId}/getUserPurchases?page=${state.page}&size=${state.size}`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
};

export const getUserSales = async (userId, state, onSuccess, onErrors) => {
  return appFetch(
    `/purchase/${userId}/getUserSales?page=${state.page}&size=${state.size}`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
};

export const getPurchaseById = async (purchaseId, onSuccess, onErrors) => {
  return appFetch(
    `/purchase/${purchaseId}/getPurchase`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
};

export const changeRefundStatus = async (
  purchaseId,
  isRefunded,
  onSuccess,
  onErrors
) => {
  appFetch(
    `/purchase/${Number(purchaseId)}/changeRefundStatus`,
    fetchConfig("PUT", isRefunded),
    onSuccess,
    onErrors
  );
};

export const changePurchaseStatus = async (
  purchaseId,
  purchaseStatus,
  onSuccess,
  onErrors
) => {
  appFetch(
    `/purchase/${Number(purchaseId)}/changePurchaseStatus`,
    fetchConfig("PUT", { purchaseStatus }),
    onSuccess,
    onErrors
  );
};

export const deletePurchase = async (purchaseId, onSuccess, onErrors) => {
  appFetch(
    `/purchase/${purchaseId}/delete`,
    fetchConfig("DELETE"),
    onSuccess,
    onErrors
  );
};


export const countPurchases = async (userId, onSuccess, onErrors) => {
  appFetch(
    `/purchase/${userId}/countPurchases`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
}


export const countRefundedPurchases = async (userId, onSuccess, onErrors) => {
  appFetch(
    `/purchase/${userId}/countRefundedPurchases`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
};

export const countCompletedPurchases = async (userId, onSuccess, onErrors) => {
  appFetch(
    `/purchase/${userId}/countCompletedPurchases`,
    fetchConfig("GET"),
    onSuccess,
    onErrors
  );
};
