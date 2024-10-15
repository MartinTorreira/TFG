import React from "react";
import { formatDate } from "../../utils/formatDate";
import { Badge } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export const UserPurchaseList = ({ purchases }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    //   navigate(`../payment/purchaseTicket/${id}/`);
  };

  return (
    <section className="w-9/12 mx-auto bg-gray-50 rounded-lg antialiased dark:bg-gray-900 md:p-8 shadow-sm">
      <div className="mx-auto px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 lg:flex lg:items-center lg:justify-between  ">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Mis compras
            </h2>

            <div className="mt-6 gap-4 flex items-center justify-end space-x-4 lg:mt-0">
              <div>
                <label
                  htmlFor="order-type"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select order type
                </label>
                <select
                  id="order-type"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:w-[144px]"
                >
                  <option defaultValue>All orders</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              <span className="inline-block text-gray-500 dark:text-gray-400">
                from
              </span>

              <div>
                <label
                  htmlFor="date"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select date
                </label>
                <select
                  id="date"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:w-[144px]"
                >
                  <option defaultValue>this week</option>
                  <option value="this month">this month</option>
                  <option value="last 3 months">the last 3 months</option>
                  <option value="last 6 months">the last 6 months</option>
                  <option value="this year">this year</option>
                </select>
              </div>
            </div>
          </div>

          {purchases &&
            purchases.map((purchase) => (
              <div key={purchase.orderId} className="mt-6 flow-root sm:mt-8">
                <div className="divide-y divide-gray-200 dark:divide-gray-700  ">
                  <div className="grid grid-cols-5 gap-x-4 py-6  border-b">
                    <div className="flex flex-col justify-center space-y-1">
                      <span className="text-sm font-semibold text-gray-500">
                        ID de compra
                      </span>
                      <span
                        href="#"
                        className="text-base font-semibold text-gray-900 hover:underline dark:text-white"
                      >
                        #{purchase.orderId}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center space-y-1 ml-6">
                      <span className="text-sm font-semibold text-gray-500">
                        Fecha
                      </span>
                      <div className="flex items-center gap-2">
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
                        <p className="text-base font-medium text-gray-800 dark:text-gray-400">
                          {formatDate(purchase.purchaseDate, "-")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-1">
                      <span className="text-sm font-semibold text-gray-500">
                        Estado
                      </span>
                      <span className="w-1/2 rounded-full border border-red-100 bg-red-100 text-red-900 text-sm text-center">
                        En progreso
                      </span>
                    </div>

                    <div className="flex flex-col justify-center space-y-1">
                      <span className="text-sm font-semibold text-gray-500">
                        Total
                      </span>
                      <p className="text-base font-medium text-gray-800 dark:text-gray-400">
                        {purchase.amount.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>

                    <div className="flex justify-center sm:justify-end -py-2">
                      <button
                        type="button"
                        className="text-accent-darker hover:underline text-sm font-bold  rounded-lg px-2 hover:opacity-80 transition-all"
                      >
                        Ver detalles
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
