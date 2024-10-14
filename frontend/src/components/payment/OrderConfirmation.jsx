import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPurchaseByProductId } from "../../backend/paymentService";
import { getProductById } from "../../backend/productService";
import { toast } from "sonner";
import { getPlaceName } from "../../utils/MapUtils.js";
import { LoadScript } from "@react-google-maps/api";
import { formatDate } from "../../utils/formatDate.js";
import { getProductsByPurchaseId } from "../../backend/productService.js";

const OrderSummary = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("reach here");
    getProductsByPurchaseId(
      id,
      (data) => {
        setProducts(data);
      },
      (error) => {
        toast.error("Error loading products");
      },
    );
  }, [products, id]);

  const getAmount = () => {
    let cnt = 0;
    if (products) {
      products.forEach((item) => {
        cnt += item.price;
      });
    }
    console.log("total", cnt);
    return cnt;
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-6">
            Resumen de compra
          </h2>

          <dl>
            <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
              <p>
                El vendedor <strong>{products[0]?.userDto?.userName}</strong>{" "}
                está listo para enviarte el producto que adquiriste. ¡Gracias
                por tu compra! A continuación, encontrarás más detalles sobre la
                transacción.
              </p>
            </dd>
          </dl>

          <div className="mt-6 sm:mt-8">
            <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
              <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 md:w-[384px]">
                        <div className="flex items-center gap-4">
                          <a
                            href="#"
                            className="flex items-center aspect-square w-10 h-10 shrink-0"
                          >
                            <img
                              className="h-auto w-full max-h-full dark:hidden"
                              src={product.images[0]}
                              alt={product.name}
                            />
                            {/* <img
                              className="hidden h-auto w-full max-h-full dark:block"
                              src={product.im}
                              alt={product.name}
                            /> */}
                          </a>
                          <a href="#" className="hover:underline">
                            {product.name}
                          </a>
                        </div>
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 dark:text-white">
                        x{product.quantity}
                      </td>
                      <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
                        {product.price.toFixed(2)}
                        {" €"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-6">
              <div className="space-y-4">
                <dt className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </dt>
                <dd className="text-lg font-bold text-gray-900 dark:text-white">
                  {/* ${(total + tax + storePickup - savings).toFixed(2)} */}
                  {getAmount}
                </dd>
              </div>

              <div className="gap-4 sm:flex sm:items-center">
                <button
                  type="button"
                  className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-opacity-80 hover:text-accent-dark hover:border-accent-dark transition-all"
                >
                  Volver al menú
                </button>

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-accent-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-80 sm:mt-0 transition-all"
                >
                  Acceder a mis compras
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default OrderSummary;
