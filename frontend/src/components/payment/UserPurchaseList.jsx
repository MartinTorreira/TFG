import React, { useContext, useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "../../icons/ShoppingBagIcon";
import usePurchasesStore from "../store/usePurchasesStore";
import { LoginContext } from "../context/LoginContext";
import { DateIcon } from "../../icons/DateIcon";
import { Spinner } from "../../icons/Spinner";

export const UserPurchaseList = ({ onRefund }) => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { purchases, loadPurchases } = usePurchasesStore();
  const [loadingRefunds, setLoadingRefunds] = useState({}); // Estado para manejar loaders por compra

  const handleNavigate = (id) => {
    navigate(`../purchase/order-confirmation/${id}/`);
  };

  useEffect(() => {
    loadPurchases(user.id);
  }, [loadPurchases, user]);

  const handleRefund = async (captureId, amount, purchaseId) => {
    setLoadingRefunds((prev) => ({ ...prev, [purchaseId]: true })); // Mostrar spinner para esta compra
    await onRefund(captureId, amount, purchaseId);
    loadPurchases(user.id);
    setLoadingRefunds((prev) => ({ ...prev, [purchaseId]: false })); // Ocultar spinner después del reembolso
  };

  return (
    <div>
      <div className="flex flex-row items-left space-x-4 mb-10 mt-16">
        <span>
          <ShoppingBagIcon size={40} />
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
          Mis compras
        </h2>
      </div>
      <section className="w-full mx-auto rounded-lg antialiased p-2 bg-gray-50">
        <div className="max-w-full px-4 sm:px-8">
          {purchases &&
            purchases.map((purchase, index) => (
              <div key={purchase.orderId} className="">
                <div
                  className={`${
                    index + 1 !== purchases.length ? "border-b" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-center lg:text-left py-4 space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* ID de compra */}
                    <div className="flex flex-col space-y-1 items-center lg:items-start lg:flex-1">
                      <span className="text-xs font-semibold text-gray-500">
                        ID de compra
                      </span>
                      <span className="text-sm font-semibold text-gray-900 hover:underline dark:text-white">
                        #{purchase.orderId}
                      </span>
                    </div>

                    {/* Fecha */}
                    <div className="flex flex-col items-center lg:items-start space-y-1 lg:flex-1">
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
                    <div className="flex flex-col space-y-1 lg:flex-1 items-center lg:items-start">
                      <span className="text-xs font-semibold text-gray-500">
                        Precio total
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                        {purchase.amount.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>

                    {/* Estado */}
                    <div className="flex flex-col items-center lg:items-start space-y-1 lg:flex-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Estado
                      </span>
                      <span className="w-full md:w-auto rounded-full border text-xs border-red-100 bg-red-100 text-red-900 text-center py-0.5 px-1">
                        En progreso
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col space-y-2 lg:flex-1 items-center lg:items-start">
                      <button
                        onClick={() => handleNavigate(purchase.id)}
                        type="button"
                        className="text-gray-800 text-xs font-bold rounded-lg px-2 hover:opacity-80 transition-all underline"
                      >
                        Más detalles
                      </button>
                      {!purchase.isRefunded && (
                        <div className="flex flex-row space-x-4">
                          <button
                            onClick={() =>
                              handleRefund(
                                purchase.captureId,
                                purchase.amount,
                                purchase.id
                              )
                            }
                            className="text-accent-darker text-xs font-bold px-2 hover:opacity-80 transition-all"
                            disabled={loadingRefunds[purchase.id]}
                          >
                            {loadingRefunds[purchase.id] ? (
                              <div className="flex items-center space-x-2">
                                <Spinner size={16} />{" "}
                                <span>Procesando...</span>
                              </div>
                            ) : (
                              "Solicitar reembolso"
                            )}
                          </button>
                        </div>
                      )}
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
