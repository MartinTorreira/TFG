import { create } from "zustand";
import {
  getCartProducts,
  addProductToCart,
  deleteItemFromCart,
  updateItemQuantity,
  getProductByItemId,
} from "../../backend/shoppingCartService";

const useCartStore = create((set, get) => ({
  cartProducts: [],
  productList: [],
  isLoading: false,
  error: null,

  setCartProducts: (cartProducts) => set({ cartProducts }),

  loadCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await new Promise((resolve, reject) => {
        getCartProducts(
          (result) => resolve(result),
          (errors) => reject(errors)
        );
      });

      if (Array.isArray(data)) {
        set({ cartProducts: data, isLoading: false });
      } else {
        console.error("Unexpected response structure:", data);
        set({ error: "Unexpected response structure", isLoading: false });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  removeFromCart: async (productId) => {
    console.log("Removing product from cart:", productId);
    try {
     // await new Promise((resolve, reject) => {
        deleteItemFromCart(
          productId,
          () => {
            set((state) => {
              const cartProducts = state.cartProducts.filter(
                (product) => product.id !== productId
              );
              get().loadCart();
              get().loadProducts();
              return { cartProducts };
            });
            //resolve();
          },
          (errors) => console.log(errors)
        );
      
   //   get().loadCart();
    } catch (error) {
      console.error(error);
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      await new Promise((resolve, reject) => {
        addProductToCart(
          productId,
          quantity,
          (result) => {
            set((state) => {
              const newCartProducts = [...state.cartProducts, result];
              return { cartProducts: newCartProducts };
            });
            resolve(result);
          },
          (errors) => reject(errors)
        );
      });
      get().loadCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  },

  isAdded: (productId) => {
    const state = get();
    return state.cartProducts.some(
      (product) => product.productId === productId
    );
  },

  

  updateQuantity: async (cartItemId, newQuantity) => {
    try {
      await new Promise((resolve, reject) => {
        updateItemQuantity(
          cartItemId,
          newQuantity,
          (updatedItem) => {
            set((state) => {
              const cartProducts = state.cartProducts.map((item) =>
                item.id === cartItemId
                  ? { ...item, quantity: newQuantity }
                  : item
              );
              return { cartProducts };
            });
            resolve(updatedItem);
          },
          (errors) => reject(errors)
        );
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  },



  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Primero obtenemos los shoppingCartItems
      const cartItems = await new Promise((resolve, reject) => {
        getCartProducts(
          (result) => resolve(result),
          (errors) => reject(errors)
        );
      });

      if (Array.isArray(cartItems)) {
        set({ cartProducts: cartItems });

        // Para cada item en el carrito, obtenemos su Product asociado
        const productsPromises = cartItems.map((item) =>
          new Promise((resolve, reject) => {
            getProductByItemId(
              item.id,
              (product) => resolve(product),
              (errors) => reject(errors)
            );
          })
        );

        // Esperamos que todas las promesas de productos se resuelvan
        const products = await Promise.all(productsPromises);

        // Almacenamos los productos en el estado
        set({ productList: products, isLoading: false });
      } else {
        console.error("Unexpected response structure:", cartItems);
        set({ error: "Unexpected response structure", isLoading: false });
      }
    } catch (error) {
      console.error("Error loading cart with products:", error);
      set({ error: error.message, isLoading: false });
    }
  },





}));

export default useCartStore;
