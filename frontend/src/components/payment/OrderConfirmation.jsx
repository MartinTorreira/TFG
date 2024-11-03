  import React, { useState, useEffect } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { getProductsByPurchaseId } from "../../backend/productService";
  import { getPlaceName } from "../../utils/MapUtils";
  import { getPurchaseById } from "../../backend/paymentService";
  import { Avatar } from "../Avatar.jsx";
  import { RatingComponent } from "../RatingComponent.jsx";
  import { CheckIcon } from "../../icons/CheckIcon.jsx";
  import { motion } from "framer-motion";

  const OrderConfirmation = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [purchase, setPurchase] = useState("");
    const [placeName, setPlaceName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
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
        getPlaceName(products[0]?.latitude, products[0]?.longitude)
          .then((result) => {
            setPlaceName(result);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }, [id, products.length]);

    useEffect(() => {
      getPurchaseById(
        id,
        (data) => {
          setPurchase(data);
        },
        (error) => {
          console.log(error);
        },
      );
    }, [id]);

    return (
      <section className="w-full max-w-3xl mt-20 mx-auto shadow-md rounded-lg bg-green-200/40 antialiased dark:bg-gray-900 p-6 md:p-10">
        <form action="#" className="mx-auto">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-montserrat">
                ¡Compra realizada!
              </h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, duration: 1000 }}
              >
                <CheckIcon size={50} />
              </motion.div>
            </div>

            <div className="mt-6 space-y-4 border-b border-t border-gray-600 py-6 md:py-8">
              <h4 className="text-lg font-semibold text-gray-900 ">Vendedor</h4>
              <dl>
                <dd className="mt-1 text-base font-normal text-gray-700">
                  <div className="flex flex-row items-center">
                    <Avatar size="10" imagePath={products[0]?.userDto.avatar} />
                    <div className="ml-2">
                      <p className="text-gray-700">
                        {products[0]?.userDto.userName}
                      </p>
                      {console.log("Valoración del usuario"+products[0]?.userDto.rate)}
                      <RatingComponent
                        rate={products[0]?.userDto.rate}
                        size="small"
                      />
                    </div>
                  </div>
                </dd>
              </dl>
            </div>

            <div className="mt-8">
              <div className="relative overflow-x-auto dark:border-gray-800">
                <table className="w-full text-left font-medium text-gray-900 dark:text-white">
                  <thead>
                    <tr>
                      <th className="text-lg font-semibold text-gray-900 ">
                        Resumen de compra
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {products.map((product, index) => (
                      <tr key={product.id} className="flex flex-col md:table-row">
                        <td className="whitespace-nowrap py-4 md:w-[384px] flex flex-col md:flex-row items-start md:items-center">
                          <img
                            className="w-16 h-16 md:w-20 md:h-20 border border-gray-800 rounded-md"
                            src={product?.images[0]}
                            alt={product.name}
                          />
                          <div className="flex flex-col mt-2 md:mt-0 md:ml-4 max-w-1/2 space-y-1">
                            <div className="flex flex-row space-x-3">
                              <span className="">{product.name}</span>
                              <span className="">
                                x{purchase?.purchaseItems?.[index]?.quantity || 0}
                              </span>
                            </div>
                            <span className="mt-1 text-sm text-gray-700 truncate">
                              {placeName}
                            </span>
                            <span className="text-base justify-end text-gray-900">
                              {purchase?.amount?.toFixed(2).replace(".", ",")} €
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => navigate("../home")}
                  type="button"
                  className="w-full sm:w-1/4 rounded-full bg-gray-900 p-1.5 text-white font-semibold text-base hover:bg-opacity-80 transition-all"
                >
                  Volver
                </button>
                <button
                  onClick={() => navigate("../users/my-purchases")}
                  className="w-full sm:w-1/4 rounded-full bg-gray-900 p-1.5 text-white font-semibold text-base hover:bg-opacity-80 transition-all"
                >
                  Mis compras
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  };

  export default OrderConfirmation;
