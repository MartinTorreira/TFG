import React, { useEffect } from "react";
import { CardItem } from "./CardItem.jsx";
import useFavoriteStore from "../store/useFavoriteStore";
import { useProductStore } from "../store/useProductStore";
import Paginator from "../Paginator.jsx";

export const CardGrid = () => {
  const { loadFavorites } = useFavoriteStore();
  const { filteredProducts, page, totalPages, setPage, fetchProducts } = useProductStore();

  useEffect(() => {
    const fetchFavorites = async () => {
      await loadFavorites();
    };
    fetchFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-3 gap-12 max-w-screen-lg mx-auto mt-20">
        {filteredProducts && filteredProducts.map((product, index) => (
          <CardItem key={index} product={product} />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4">
        <Paginator
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};