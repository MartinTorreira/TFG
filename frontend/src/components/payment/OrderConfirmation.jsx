import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByPurchaseId } from "../../backend/productService";
import { getPlaceName } from "../../utils/MapUtils";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products and update state
    getProductsByPurchaseId(
      id,
      (data) => {
        setProducts(data);
      },
      (error) => {
        console.log(error);
      },
    );

    if (products.length > 0) {
      getPlaceName(products[0].latitude, products[0].longitude)
        .then((result) => {
          setPlaceName(result);
        })
        .catch((error) => {
          console.error("Error:", error); // Manejo de errores
        });
    }
  }, [id, products.length]);

  return (
    <section className="w-5/12 mt-20 mx-auto shadow-md rounded-lg bg-gray-50 antialiased dark:bg-gray-900 md:py-8 sm:p-10">
      <form action="#" className="mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white font-montserrat">
            ¡Compra realizada!
          </h2>

          <div className="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendedor
            </h4>

            <dl>
              <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                {products[0]?.userDto.userName}
              </dd>
            </dl>
          </div>

          <div className="mt-4">
            <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
              <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {products?.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 md:w-[384px]">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-4">
                            {" "}
                            {/* Mantener alineados horizontalmente */}
                            <span className="flex items-center aspect-square w-16 h-16 shrink-0">
                              <img
                                className="w-full border border-gray-200 rounded-md"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            </span>
                            <a href="#" className="hover:underline flex-1">
                              {product.name}
                            </a>
                            <span className="mr-10">x{product.quantity}</span>
                            <span className="text-right text-base font-bold text-gray-900 dark:text-white">
                              {product.price} €
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {" "}
                            {placeName}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 -mb-2">
              <div className="gap-4 sm:flex sm:items-center">
                <button
                  onClick={() => navigate("../home")}
                  type="button"
                  className="w-1/3 mx-auto rounded-lg border border-gray-200 bg-accent-dark p-1.5 text-white font-semibold text-base hover:bg-opacity-80 transition-all"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default OrderConfirmation;
