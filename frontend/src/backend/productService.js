import { fetchConfig, appFetch } from "./appFetch";

export const getProducts = async (onSuccess, onErrors) => {
  const url =
    "https://wallapop3.p.rapidapi.com/search?query=camaras&minPrice=10&maxPrice=20&sort=mostRecent";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "3504c17f77mshc140398805dcf14p1ecc94jsn13841641caaa",
      "x-rapidapi-host": "wallapop3.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
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
