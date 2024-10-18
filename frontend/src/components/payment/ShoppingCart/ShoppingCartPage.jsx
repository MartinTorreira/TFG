import React, { useEffect } from "react";
import useCartStore from "../../store/useCartStore";

const ShoppingCartPage = () => {
  const { cartProducts, loadCart, productList, loadProducts, isLoading, error } = useCartStore();

  // Carga el carrito cuando el componente se monta
  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Renderiza el carrito
  return (
    <div>
      {isLoading && <p>Loading cart...</p>}
      {error && <p>Error loading cart: {error}</p>}
      
      {!isLoading && cartProducts.length === 0 && <p>Your cart is empty</p>}

      {!isLoading && cartProducts.length > 0 && (
        <ul>
          {cartProducts.map((product) => (
            <li key={product.id}>
              <p>Product ID: {product.id}</p>
              <p>Product Quantity: {product.quantity}</p>
              {/* Renderiza más información del producto si es necesario */}
            </li>
          ))}
        </ul>
        
      )}
       {!isLoading && productList.length > 0 && (
        <ul>
          {productList.map((product) => (
            <li key={product.id}>
              <p>Product ID: {product.name}</p>
              <p>Product Quantity: {product.quantity}</p>
              {/* Renderiza más información del producto si es necesario */}
            </li>
          ))}
        </ul>
        
      )}
    </div>
  );
};

export default ShoppingCartPage;
