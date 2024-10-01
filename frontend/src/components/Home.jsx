import React, { useContext, useEffect } from "react";
import { LoginContext } from "./context/LoginContext";
import { config } from "../config/constants";
import { CardGrid } from "./product/CardGrid.jsx";
import { useProductStore } from "./store/useProductStore";

const Home = () => {
  const { price, category, fetchProducts, filteredProducts, products, query } =
    useProductStore();

  let { token, setToken, setUser, user, image } = useContext(LoginContext);

  const avatar = user.avatar;

  useEffect(() => {
    const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);
    const user = localStorage.getItem("user");

    if (bearer !== null) {
      setToken(bearer);
      setUser(JSON.parse(user));
    }
  }, [setToken, setUser]);

  useEffect(() => {
    // Ejecutar fetchProducts cada 10s
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  return <CardGrid productList={products} />;
};

export default Home;
