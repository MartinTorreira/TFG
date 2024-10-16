import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuantitySelector } from "../form/QuantitySelector";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener la lista de productos del estado de la navegación
  const productList = location.state?.productList || [];

  // Estado para la cantidad total y las cantidades seleccionadas por el usuario
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState(
    productList.map((product) => product.quantity), // Inicializamos las cantidades con la cantidad disponible de cada producto
  );

  // Calcular el importe total basado en las cantidades y precios de los productos
  const getAmount = () => {
    let total = 0;
    productList.forEach((item, index) => {
      total += item.price * quantities[index]; // Multiplicar precio por cantidad seleccionada
    });
    setTotalAmount(total);
  };

  useEffect(() => {
    getAmount();
  }, [quantities]);

  const handleQuantityChange = (index, newQuantity) => {
    const product = productList[index];
    if (newQuantity > product.quantity) {
      alert("No puedes seleccionar más productos de los disponibles.");
      return;
    }
    const newQuantities = [...quantities];
    newQuantities[index] = newQuantity;
    setQuantities(newQuantities);
  };

  // Manejar el evento para proceder al pago
  const handleProceedToPayment = () => {
    const productsWithQuantities = productList.map((product, index) => ({
      ...product,
      originalQuantity: product.quantity, // Guardamos la cantidad original para restarla después
      quantity: quantities[index], // Actualizamos con la cantidad seleccionada
    }));

    const hasNegativeQuantity = productsWithQuantities.some(
      (product) => product.quantity < 0,
    );

    if (hasNegativeQuantity) {
      alert("No puedes seleccionar más productos de los disponibles.");
      return;
    }

    // Navegar a la página de pago con los productos seleccionados
    navigate("/payment", {
      state: { products: productsWithQuantities },
    });
  };

  return (
    <section className="mt-10 rounded-lg shadow-md w-1/2 mx-auto bg-gray-50 antialiased dark:bg-gray-900 md:py-8 sm:p-3">
      <form action="#" className="mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-6 mt-2">
            Resumen de compra
          </h2>

          <div className="mt-10 space-y-10">
            <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
              <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {productList.map((product, index) => (
                    <tr key={index}>
                      <td className="p-4 w-1/6 px-6 items-center justify-center text-base font-normal text-gray-900 dark:text-white">
                        <QuantitySelector
                          maxQuantity={product.quantity} // Cantidad disponible del producto
                          initialQuantity={quantities[index]} // Cantidad inicial seleccionada
                          onQuantityChange={
                            (newQuantity) =>
                              handleQuantityChange(index, newQuantity) // Actualización de la cantidad cuando el usuario cambia el valor
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 md:w-[384px]">
                        <div className="flex items-center gap-4">
                          <a
                            href="#"
                            className="flex items-center aspect-square w-10 h-10 shrink-0"
                          >
                            <img
                              className="h-auto w-full max-h-full rounded-md"
                              src={product.images[0]} // Primera imagen del producto
                              alt={product.name}
                            />
                          </a>
                          <a href="#" className="hover:underline">
                            {product.name}
                          </a>
                        </div>
                      </td>
                      <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
                        {product.price.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      className="p-4 text-lg font-bold text-gray-900 dark:text-white"
                      colSpan={2}
                    >
                      Total
                    </td>
                    <td className="p-4 text-right text-lg font-bold text-gray-900 dark:text-white">
                      {totalAmount.toFixed(2)} €
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="gap-4 sm:flex sm:items-center justify-end">
              <button
                onClick={() => navigate("../home")}
                type="button"
                className="w-1/4 rounded-lg  border border-gray-400 bg-white py-2 text-base font-medium text-gray-900 hover:bg-opacity-80 hover:text-accent-dark hover:border-accent-dark transition-all"
              >
                Volver al menú
              </button>

              <button
                onClick={handleProceedToPayment}
                type="submit"
                className="mt-4 flex w-1/4 items-center justify-center rounded-lg bg-accent-dark py-2 text-base font-medium text-white hover:bg-opacity-80 sm:mt-0 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default OrderSummary;
