import React, { useContext, useEffect } from "react";
import { LoginContext } from "./context/LoginContext";
import { config } from "../config/constants";
import { CardGrid } from "./product/CardGrid.jsx";
import { useProductStore } from "./store/useProductStore";
import useFavoriteStore from "./store/useFavoriteStore"; // Asegúrate de que la ruta sea correcta

const Home = () => {
  const { price, category, fetchProducts, products } = useProductStore();
  const { loadFavorites } = useFavoriteStore();
  let { token, setToken, setUser, user } = useContext(LoginContext);

  useEffect(() => {
    const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);
    const user = localStorage.getItem("user");

    if (bearer) {
      setToken(bearer);
      setUser(JSON.parse(user));
    }
  }, [setToken, setUser]);

  useEffect(() => {
    const loadData = async () => {
      await loadFavorites(); // Cargar favoritos
      await fetchProducts(); // Cargar productos
    };

    loadData(); // Llama a la función async
  }, [loadFavorites, fetchProducts]); // Asegúrate de que las dependencias sean correctas

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  return <CardGrid productList={products} />;
};

export default Home;
