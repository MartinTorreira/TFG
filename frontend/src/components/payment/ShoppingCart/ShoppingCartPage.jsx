import React, { useEffect, useState } from "react";
import useCartStore from "../../store/useCartStore";
import ShoppingCartItem from "./ShoppingCartItem";
import { useNavigate } from "react-router-dom";

const ShoppingCartPage = () => {
  const {
    cartProducts,
    loadCart,
    loadProducts,
    productList,
    isLoading,
    error,
    removeFromCart,
  } = useCartStore();
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState(
    productList.map((product) => product.quantity)
  );

  const navigate = useNavigate();

  // Cargar productos del carrito al montar el componente
  useEffect(() => {
    loadCart();
    loadProducts();
  }, [loadCart, loadProducts, removeFromCart]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      const initialQuantities = cartProducts.map((product) => product.quantity);
      setQuantities(initialQuantities);
    }
  }, [cartProducts]);

  // Calcular el total del carrito basado en las cantidades y los precios
  useEffect(() => {
    if (productList.length > 0) {
      const total = productList.reduce((sum, product, index) => {
        return sum + (product?.price || 0) * (quantities[index] || 0);
      }, 0);
      setTotalAmount(total);
    }
  }, [quantities, productList]);

  const handleQuantityChange = (index, newQuantity) => {
    const product = productList[index];
    if (newQuantity > product.quantity) {
      alert("No puedes seleccionar más productos de los disponibles.");
      return;
    }

    const newQuantities = [...quantities];
    newQuantities[index] = newQuantity;
    setQuantities(newQuantities); // Actualiza el estado con las nuevas cantidades
  };

  // Proceder al pago pasando datos a /payment
  const handleProceedToPayment = () => {
    const productsWithQuantities = productList.map((product, index) => ({
      ...product,
      originalQuantity: product.quantity, // Cantidad original del producto
      quantity: quantities[index], // Cantidad seleccionada por el usuario
    }));

    const hasNegativeQuantity = productsWithQuantities.some(
      (product) => product.quantity < 0
    );

    navigate("/payment", {
      state: { products: productsWithQuantities },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl text-left">
          Carro de compra
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 justify-center">
          <div className="w-full lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {productList.length > 0 ? (
                productList.map((product, index) => (
                  <ShoppingCartItem
                    key={product.id}
                    product={product}
                    initialQuantity={quantities[index]} // Cantidad inicial del producto
                    maxQuantity={product.quantity} // Cantidad máxima disponible del producto
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(index, newQuantity)
                    } // Maneja el cambio de cantidad
                    index={index} // Pasa el índice al componente hijo
                  />
                ))
              ) : (
                <div>No hay productos en el carrito</div>
              )}
            </div>
          </div>

          <div className="mt-6 lg:mt-0 lg:w-full max-w-sm">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 mx-auto">
              <p className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-16">
                Resumen de compra
              </p>

              <div className="space-y-4">
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    {totalAmount.toFixed(2)} €
                  </dd>
                </dl>
              </div>

              <button
                onClick={() => handleProceedToPayment()}
                className="flex w-full items-center justify-center rounded-lg bg-accent-darker px-5 py-2.5 text-md font-medium text-white hover:bg-opacity-80"
              >
                Proceder a pagar
              </button>

              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {" "}
                  o{" "}
                </span>
                <button
                  href="#"
                  title=""
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent-darker underline hover:no-underline dark:text-primary-500"
                >
                  Continua comprando
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCartPage;
