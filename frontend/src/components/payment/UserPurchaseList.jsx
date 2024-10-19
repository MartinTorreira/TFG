import React from "react";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "../../icons/ShoppingBagIcon";

export const UserPurchaseList = ({ purchases }) => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`../purchase/order-confirmation/${id}/`);
  };

  return (
    <section className="4xl:w-8/12 sm:w-full mx-auto  rounded-lg antialiased p-8 bg-gray-50 ">
      <div className="mx-auto px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="xl:flex xl:items-center flex-row items-start space-x-4">
            <span>
              <ShoppingBagIcon size={40} />
            </span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Mis compras
            </h2>

            <div className="mt-6 gap-4 flex items-center justify-end space-x-4 lg:mt-0">
              {/* Filtros de orden y fecha */}
            </div>
          </div>

          {purchases &&
            purchases.map((purchase) => (
              <div key={purchase.orderId} className="mt-6 flow-root sm:mt-8 ">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="grid grid-cols-1 2xl:grid-cols-5 gap-x-18 py-6 border-b">
                    {/* ID de compra */}
                    <div className="flex flex-col justify-center 2xl:items-start items-center space-y-4 2xl:space-y-1">
                      <span className="text-xs font-semibold text-gray-500">
                        ID de compra
                      </span>
                      <span className="text-sm font-semibold text-gray-900 hover:underline dark:text-white">
                        #{purchase.orderId}
                      </span>
                    </div>

                    {/* Fecha */}
                    <div className="flex flex-col justify-center 2xl:items-start items-center space-y-4 2xl:space-y-1 ml-4">
                      <span className="text-xs font-semibold text-gray-500">
                        Fecha
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Icono de calendario */}
                        <svg
                          className="h-4 w-4 text-gray-800"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                          {formatDate(purchase.purchaseDate, "-")}
                        </p>
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="flex flex-col justify-center 2xl:items-start items-center space-y-4 2xl:space-y-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Estado
                      </span>
                      <span className="w-1/2 rounded-full border border-red-100 bg-red-100 text-red-900 text-sm text-center">
                        En progreso
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col justify-center 2xl:items-start items-center space-y-4 2xl:space-y-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Precio total
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                        {purchase.amount.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>

                    {/* Botón de ver detalles */}
                    <div className="flex flex-col justify-center 2xl:items-start items-center space-y-4 2xl:space-y-1">
                      <button
                        onClick={() => handleNavigate(purchase.id)}
                        type="button"
                        className="text-accent-darker hover:underline text-sm font-bold rounded-lg px-2 hover:opacity-80 transition-all"
                      >
                        Más detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
