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
    <section className="bg-gray-50 p-10 rounded-lg antialiased dark:bg-gray-900 md:py-8">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Mis compras
            </h2>

            <div className="mt-6 gap-4 space-y-4 sm:flex sm:items-center sm:space-y-0 lg:mt-0 lg:justify-end">
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
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1">
                      <div className="flex flex-col text-left justify-center space-y-1">
                        <span className="text-sm text-gray-500">Order ID</span>
                        <span
                          href="#"
                          className="text-base font-semibold text-gray-900 hover:underline dark:text-white"
                        >
                          #{purchase.orderId}
                        </span>
                      </div>
                    </div>

                    <div className="content-center flex flex-col text-left space-y-1">
                      <span className="text-sm text-gray-500">Date</span>
                      <div>
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
                    </div>

                    <div className="content-center">
                      {purchase.purchaseItems.map((item) => (
                        <div key={item.id} className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-500">
                            Precio total:
                          </span>
                          <p className="text-base font-medium text-gray-800 dark:text-gray-400">
                            {purchase.amount.toFixed(2).replace(".", ",")}
                            {" €"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">Status</span>
                        <Badge color="red" className="rounded">
                          In progress
                        </Badge>
                      </div>
                    </div>

                    <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">
                      <button
                        type="button"
                        className="w-full text-white rounded-lg border border-gray-200 bg-accent-dark px-3 py-2 text-sm font-medium hover:opacity-80 transition-all  sm:w-auto"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <nav
            class="mt-2 flex items-center justify-center sm:mt-8"
            aria-label="Page navigation example"
          >
            <ul class="flex h-8 items-center -space-x-px text-sm">
              <li>
                <a
                  href="#"
                  class="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="h-4 w-4 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m15 19-7-7 7-7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  class="z-10 flex h-8 items-center justify-center border border-primary-300 bg-primary-50 px-3 leading-tight text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  ...
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  100
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="h-4 w-4 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m9 5 7 7-7 7"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};
