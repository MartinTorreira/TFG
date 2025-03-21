import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuantitySelector } from "../form/QuantitySelector";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const productList = location.state?.productList || [];
  const disableQuantities = location.state?.disableQuantities || false;

  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState(
    productList.map((product) => product.quantity)
  );

  useEffect(() => {
    const getAmount = () => {
      let total = 0;
      productList.forEach((item, index) => {
        total += item.price * quantities[index];
      });
      setTotalAmount(total);
    };

    getAmount();
  }, [quantities, productList]);

  const handleQuantityChange = (index, newQuantity) => {
    if (disableQuantities) return;

    const product = productList[index];
    if (newQuantity > product.quantity) {
      alert("No puedes seleccionar más productos de los disponibles.");
      return;
    }
    const newQuantities = [...quantities];
    newQuantities[index] = newQuantity;
    setQuantities(newQuantities);
  };

  const handleProceedToPayment = () => {  
    const productsWithQuantities = productList.map((product, index) => ({
      ...product,
      originalQuantity: product.quantity,
      quantity: quantities[index],
    }));
  
    const hasNegativeQuantity = productsWithQuantities.some(
      (product) => product.quantity < 0
    );
  
    if (hasNegativeQuantity) {
      alert("No puedes seleccionar más productos de los disponibles.");
      return;
    }
  
    console.log("Navigating to PayPalPayment with state:", {
      products: productsWithQuantities,
    });
  
    navigate("/payment", {
      state: { products: productsWithQuantities, isOffer: disableQuantities },
    });
  };

  return (
    <section className="mt-10 rounded-lg shadow-md w-full max-w-4xl mx-auto bg-gray-50 antialiased dark:bg-gray-900 md:py-8 sm:p-3">
      <form action="#" className="mx-auto max-w-screen-xl px-10">
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
                          maxQuantity={product.quantity}
                          initialQuantity={quantities[index]}
                          onQuantityChange={(newQuantity) =>
                            handleQuantityChange(index, newQuantity)
                          }
                          //disabled={disableQuantities}
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
                              src={product.images[0]}
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
                  <tr className="">
                    <td></td>
                    <td></td>
                    <td className="p-4 text-right text-lg font-bold text-gray-900 space-x-6">
                      <span>Total</span>
                      <span>{totalAmount.toFixed(2).replace(".", ",")} €</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="gap-4 sm:flex sm:items-center justify-end">
              <button
                onClick={() => navigate("../home")}
                type="button"
                className="w-full sm:w-auto rounded-full border border-gray-400 bg-white p-1.5 text-base font-medium text-gray-900 hover:bg-opacity-80 hover:text-accent-dark hover:border-accent-dark transition-all"
              >
                Volver al menú
              </button>

              <button
                onClick={handleProceedToPayment}
                type="submit"
                className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center rounded-full bg-accent-dark p-1.5 text-base font-medium text-white hover:bg-opacity-80 transition-all"
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