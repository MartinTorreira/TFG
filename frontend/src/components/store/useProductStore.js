import { create } from "zustand";
import {
  getProducts,
  updateProduct as updateProductService,
} from "../../backend/productService";

export const useProductStore = create((set, get) => ({
  price: "",
  category: "all",
  query: "",
  quality: "--",
  products: [],
  filteredProducts: [],
  favouriteProducts: [],
  sort: null,

  setPriceFilter: (price) => {
    set({ price });
    get().filterProducts();
  },
  setCategoryFilter: (category) => {
    set({ category });
    get().filterProducts();
  },
  setFilteredQuery: (query) => {
    set({ query });
    get().filterProducts();
  },
  setQualityFilter: (quality) => {
    set({ quality });
    get().filterProducts();
  },
  setStateFilter: (state) => {
    set({ state });
    get().filterProducts();
  },
  setProducts: (products) => set({ products }),
  setFilteredProducts: (filteredProducts) => set({ filteredProducts }),
  setFavoriteProducts: (favouriteProducts) => set({ favouriteProducts }),
  setSort: (sort) => {
    set({ sort });
    get().filterProducts();
  },

  fetchProducts: async () => {
    try {
      getProducts(
        { page: 0, size: 10 },
        (data) => {
          set({ products: data.content });
          set({ filteredProducts: data.content });
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error(error);
    }
  },

  filterProducts: () => {
    const { query, category, price, quality, state, products } = get();
    let filteredProducts = products;
    // Filtrar por texto de búsqueda
    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Filtrar por categoría
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((product) => {
        return product.categoryDto.id === category;
      });
    }

    // Filtrar por rango de precios
    if (price && Array.isArray(price) && price.length === 2) {
      const [minPrice, maxPrice] = price.map(Number);
      filteredProducts = filteredProducts.filter((product) => {
        const productPrice = Number(product.price);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }

    // Filtrar por calidad
    if (quality && quality !== "--") {
      filteredProducts = filteredProducts.filter((product) => {
        return product.quality === quality;
      });
    }

    // Filtrar por estado
    if (state && state !== "Todos") {
      filteredProducts = filteredProducts.filter((product) => {
        return product.state === state;
      });
    }

    // Actualizar la lista de productos filtrados
    set({ filteredProducts });
  },

  getProductById: (id) => {
    const { products } = get();

    if (products.length === 0) {
      get().fetchProducts();
      return null;
    }

    return products.find((product) => product.id === id);
  },

  getFavoriteProducts: () => {
    const { products } = get();

    return products.filter((product) => product.isFavourite);
  },

  updateProduct: async (productId, updatedProduct) => {
    try {
      await updateProductService(productId, updatedProduct);
      await get().fetchProducts();
    } catch (error) {
      console.error(error);
    }
  },

  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
      filteredProducts: state.filteredProducts.filter(
        (product) => product.id !== productId,
      ),
    }));
  },
}));
