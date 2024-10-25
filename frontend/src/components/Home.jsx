import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion"; // Importar Framer Motion
import { LoginContext } from "./context/LoginContext";
import { config } from "../config/constants";
import { CardGrid } from "./product/CardGrid.jsx";
import { useProductStore } from "./store/useProductStore";
import useFavoriteStore from "./store/useFavoriteStore";
import SearchBar from "./SearchBar.jsx";
import { CategoryIcon } from "../icons/CategoryIcon.jsx";

const Home = ({ toggleSidebar }) => {
  const { fetchProducts, filteredProducts } = useProductStore();
  const { loadFavorites } = useFavoriteStore();
  const { setToken, setUser } = useContext(LoginContext);
  const [showText, setShowText] = useState(false);

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
  }, [loadFavorites, fetchProducts]);

  return (
    <div>
      <div className="flex mt-20 w-1/3 mx-auto">
        <SearchBar />
        <div className="relative ml-2">
          <motion.button
            onClick={toggleSidebar}
            onMouseEnter={() => setShowText(true)}
            onMouseLeave={() => setShowText(false)}
            className="bg-gray-900 text-gray-100 p-3 rounded-full transition duration-300 flex items-center"
            initial={{ width: "3rem" }}
            animate={{ width: showText ? "6rem" : "3rem" }}
          >
            <CategoryIcon size={6} />
            {showText && (
              <motion.span
                className="ml-2 text-xs text-white"
                initial={{ opacity: 0, translateX: 10 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-base">Filtros</p>
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
        <CardGrid productList={filteredProducts} />
    </div>
  );
};

export default Home;
