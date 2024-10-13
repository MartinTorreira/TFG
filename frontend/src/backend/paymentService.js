import { appFetch, fetchConfig } from "./appFetch";

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
