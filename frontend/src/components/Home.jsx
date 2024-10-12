import React, { useContext, useEffect } from "react";
import { LoginContext } from "./context/LoginContext";
import { config } from "../config/constants";
import { CardGrid } from "./product/CardGrid.jsx";
import { useProductStore } from "./store/useProductStore";
import useFavoriteStore from "./store/useFavoriteStore";
import SearchBar from "./SearchBar.jsx";
import { CategoryIcon } from "../icons/CategoryIcon.jsx";

const Home = ({ toggleSidebar }) => {
  const { fetchProducts, filteredProducts, removeProduct } = useProductStore();
  const { loadFavorites } = useFavoriteStore();
  let { token, setToken, setUser } = useContext(LoginContext);

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
      await loadFavorites();
      await fetchProducts();
    };

    loadData();
  }, [loadFavorites, fetchProducts, removeProduct]);

  return (
    <>
      <div className="mt-20 w-1/4 mx-auto h-full py-4 flex justify-between items-center gap-x-2 ">
        <SearchBar />
        <button
          onClick={toggleSidebar}
          className="bg-gray-900 text-gray-100 p-3 rounded-full"
        >
          <CategoryIcon size={28} />
        </button>
      </div>
      <CardGrid productList={filteredProducts} />
    </>
  );
};

export default Home;
