import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { DateIcon } from "../../icons/DateIcon";
import { MoneyIcon } from "../../icons/MoneyIcon.jsx";
import { purchaseStatusMap } from "../../utils/Qualities.js";
import { getUserById } from "../../backend/userService";
import { Avatar } from "../Avatar.jsx";

export const UserSalesList = ({ sales }) => {
  const navigate = useNavigate();
  const [statusMap, setStatusMap] = useState({});
  const [userDataMap, setUserDataMap] = useState({});

  const handleNavigate = (id) => {
    // navigate(`../purchase/order-confirmation/${id}/`);
  };

  useEffect(() => {
    if (sales?.length > 0) {
      const newStatusMap = {};
      sales.forEach((sale) => {
        const status = purchaseStatusMap.find(
          (item) => item.value === sale.purchaseStatus
        );
        if (status) {
          newStatusMap[sale.id] = status;
        } else {
          newStatusMap[sale.id] = { label: "Desconocido", color: "gray" };
        }
      });
      setStatusMap(newStatusMap);
    }
  }, [sales]);

  const getUserData = async (userId) => {
    // Evitar volver a hacer solicitudes para el mismo usuario
    if (!userDataMap[userId]) {
      getUserById(
        userId,
        (data) => {
          setUserDataMap((prev) => ({ ...prev, [userId]: data }));
        },
        (errors) => {
          console.log(errors);
        }
      );
    }
  };

  // useEffect to get User data for each sale
  useEffect(() => {
    sales.forEach((sale) => {
      getUserData(sale.buyerId);
    });
  }, [sales]);

  return (
    <div>
      <div className="flex flex-row items-center space-x-2 mb-10 mt-16 w-fit">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl mb-0">
          Mis ventas
        </h2>
        <span>
          <MoneyIcon size={30} />
        </span>
      </div>

      <section className="w-full mx-auto rounded-lg antialiased p-4 bg-gray-50">
        <div className=" space-y-4">
          {sales &&
            sales.map((sale, index) => (
              <div
                key={sale.orderId}
                className={`border-b border-gray-400 ${
                  index + 1 !== sales.length ? "mb-4" : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-4">
                  {/* ID de compra */}
                  <div className="flex flex-col items-center lg:items-start space-y-1">
                    <span className="text-xs font-semibold text-gray-500">
                      ID de venta
                    </span>
                    <button
                      onClick={() => handleNavigate(sale.id)}
                      className="text-sm font-semibold text-gray-900 hover:underline dark:text-white"
                    >
                      #{sale.orderId}
                    </button>
                  </div>

                  {/* Fecha */}
                  <div className="flex flex-col items-center lg:items-start space-y-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Fecha
                    </span>
                    <div className="flex gap-2 items-center">
                      <DateIcon />
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                        {formatDate(sale.purchaseDate, "-")}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex flex-col items-center lg:items-start space-y-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Precio total
                    </span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                      {sale.amount.toFixed(2).replace(".", ",")} €
                    </p>
                  </div>

                  {/* Estado */}
                  <div className="flex flex-col items-center lg:items-start space-y-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Estado
                    </span>
                    <span
                      className={`flex items-center space-x-1 rounded-full border text-xs border-${
                        statusMap[sale.id]?.color
                      } bg-${statusMap[sale.id]?.color}-100 text-${
                        statusMap[sale.id]?.color
                      }-900 px-2 py-1`}
                    >
                      <span>{statusMap[sale.id]?.label}</span>
                      {statusMap[sale.id]?.icon}
                    </span>
                  </div>

                  {/* Comprador */}
                  <div className="flex flex-col items-center lg:items-start space-y-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Comprador
                    </span>
                    <p className="text-sm font-medium ">
                      {userDataMap[sale.buyerId]?.userName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};