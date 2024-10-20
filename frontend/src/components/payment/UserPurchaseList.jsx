import React, { useContext, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "../../icons/ShoppingBagIcon";
import usePurchasesStore from "../store/usePurchasesStore";
import { LoginContext } from "../context/LoginContext";
import { DateIcon } from "../../icons/DateIcon";

export const UserPurchaseList = ({ onRefund }) => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { purchases, loadPurchases } = usePurchasesStore();

  const handleNavigate = (id) => {
    navigate(`../purchase/order-confirmation/${id}/`);
  };

  useEffect(() => {
    loadPurchases(user.id);
  }, [loadPurchases, user]);

  return (
    <div>
      <div className="flex flex-row items-left space-x-4 mb-6">
        <span>
          <ShoppingBagIcon size={40} />
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Mis compras
        </h2>
      </div>
      <section className="w-full mx-auto rounded-lg antialiased p-2 bg-gray-50">
        <div className="max-w-full px-4 sm:px-8">
          {purchases &&
            purchases.map((purchase, index) => (
              <div key={purchase.orderId} className="mt-6">
                <div className={`${index !== purchase.length ? "border-b" : ""} `}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between text-center lg:text-left py-4 space-y-10 lg:space-y-0 lg:space-x-4">
                    {/* ID de compra */}
                    <div className="flex flex-col space-y-1 items-center lg:items-start">
                      <span className="text-xs font-semibold text-gray-500">
                        ID de compra
                      </span>
                      <span className="text-sm font-semibold text-gray-900 hover:underline dark:text-white">
                        #{purchase.orderId}
                      </span>
                    </div>

                    {/* Fecha */}
                    <div className="flex flex-col items-center lg:items-start space-y-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Fecha
                      </span>
                      <div className="flex gap-2 items-center">
                        <DateIcon />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                          {formatDate(purchase.purchaseDate, "-")}
                        </p>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Precio total
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                        {purchase.amount.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>

                    {/* Estado */}
                    <div className="flex flex-col items-center lg:items-start space-y-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Estado
                      </span>
                      <span className="lg:w-full w-1/3 md:w-auto rounded-full border text-xs border-red-100 bg-red-100 text-red-900 text-center py-0.5 px-1">
                        En progreso
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col items-center lg:items-start sm:space-y-2 md:space-y-0 mt-4 md:mt-0 sm:gap-y-2 md:gap-y-0">
                      <button
                        onClick={() => handleNavigate(purchase.id)}
                        type="button"
                        className="text-accent-darker text-sm font-bold rounded-lg px-2 hover:opacity-80 transition-all"
                      >
                        Más detalles
                      </button>
                      <button
                        onClick={() => {
                          onRefund(purchase.captureId, purchase.amount);
                        }}
                        className="flex flex-row text-gray-900 text-sm font-bold rounded-full px-2 hover:opacity-80 transition-all space-x-2 p-1.5"
                      >
                        <span>Solicitar reembolso</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};