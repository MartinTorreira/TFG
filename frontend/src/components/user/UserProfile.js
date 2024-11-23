import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByUserId } from "../../backend/productService";
import { qualities } from "../../utils/Qualities.js";
import { Badge } from "@radix-ui/themes";
import {
  countSales,
  countCompletedSales,
  countRefundedSales,
  getUserPurchases,
} from "../../backend/paymentService";
import { getUserById } from "../../backend/userService";
import Paginator from "../Paginator.jsx";

export const UserProfile = () => {
  const { id } = useParams();
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [userDetails, setUserDetails] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [refundedSales, setRefundedSales] = useState(0);
  const [completedPurchases, setCompletedSales] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  function getQualityData(quality) {
    const qualityItem = qualities.find((item) => item.value === quality);

    if (qualityItem) {
      setLabel(qualityItem.label);
      setColor(qualityItem.color);
    } else {
      setLabel("Desconocido");
      setColor("gray");
    }
  }
  

  useEffect(() => {
    products.forEach((product) => {
      getQualityData(product.quality);
    });
  }, [products]);

  useEffect(() => {
    getProductsByUserId(
      id,
      { page, size: 3 },
      (data) => {
        console.log("datos obtenidos", data);
        setProducts(data.content);
        setTotalPages(data.totalPages);
      },
      (err) => {
        console.log(err);
      }
    );
    console.log("Obteniendo productos");
  }, [id, page]);

  useEffect(() => {
    getUserPurchases(
      id,
      { page, size: 3 },
      (data) => {
        console.log("datos purchases", data, data.content.length);
        setPurchaseCount(data.content.length);
      },
      (err) => {
        console.log(err);
      }
    );

    countSales(
      id,
      (data) => {
        setTotalSales(data);
      },
      (err) => {
        console.log(err);
      }
    );

    countCompletedSales(
      id,
      (data) => {
        setCompletedSales(data);
      },
      (err) => {
        console.log(err);
      }
    );

    countRefundedSales(
      id,
      (data) => {
        setRefundedSales(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }, [id]);

  useEffect(() => {
    getUserById(
      id,
      (data) => {
        setUserDetails(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }, [id]);

  return (
    <div className="flex mb-20 w-full">
    <section class="bg-gray-50 px-10 antialiased md:py-8 2xl:w-1/2 xl:w-2/3 w-full mx-auto mt-10">
      <div class="mx-auto max-w-screen-lg px-20 2xl:px-0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl md:mb-6">
          Información del vendedor
        </h2>
        <div class="grid grid-cols-2 gap-6 border-b border-t border-gray-200 py-4 dark:border-gray-700 md:py-8 lg:grid-cols-4 xl:gap-16">
          <div>
            <svg
              class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500"
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
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
              />
            </svg>
            <h3 class="mb-2 text-gray-500 dark:text-gray-400">
              Total de ventas
            </h3>
            <span class="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              {totalSales}
            </span>
          </div>
          <div>
            <svg
              class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-width="2"
                d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
              />
            </svg>
            <h3 class="mb-2 text-gray-500 ">Valoración</h3>
            <span class="flex flex-row items-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white">
              <p className="">
                {userDetails.rate}
                {"/5"}
              </p>
            </span>
          </div>
          <div>
            <svg
              class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500"
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
                d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
              />
            </svg>
            <h3 class="mb-2 text-gray-500 dark:text-gray-400">Completados</h3>
            <span class="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              {completedPurchases}
            </span>
          </div>
          <div>
            <svg
              class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500"
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
                d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
              />
            </svg>
            <h3 class="mb-2 text-gray-500 dark:text-gray-400">Reembolsados</h3>
            <span class="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              {refundedSales}
            </span>
          </div>
        </div>
        <div class="py-4 md:py-8">
          <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
            <div class="space-y-4">
              <div class="flex space-x-4">
                <img
                  class="h-16 w-16 rounded-lg"
                  src={userDetails.avatar}
                  alt="Helene avatar"
                />
                <div>
                  <span class="mb-2 inline-block rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    {" "}
                    {userDetails.userName}{" "}
                  </span>
                  <h2 class="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">
                    {userDetails.firstName} {userDetails.lastName}
                  </h2>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <dl class="">
                <dt class="font-semibold text-gray-900 dark:text-white">
                  Correo electrónico
                </dt>
                <dd class="text-gray-500 dark:text-gray-400">
                  {userDetails.email}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-2  md:p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Productos en venta
          </h3>
          {products.length > 0 ? (
            products.map((product) => {
              return (
                <button
                  onClick={() => {
                    navigate(`/product/${product.id}/details`);
                  }}
                  className="w-full mt-10 border border-accent-light rounded-lg"
                >
                  <div
                    key={product.id}
                    className="flex flex-wrap items-center gap-y-0 p-3 rounded-lg pb-0 md:pb-5 shadow cursor-pointer hover:bg-gray-300/20 transition-all"
                  >
                     <dl className="w-1/2 sm:w-48 text-left">
                     <img 
                      className="w-20 h-20 rounded-lg object-cover"
                      src={product.images[0]}/>
                      
                     </dl>
                    <dl className="w-1/2 sm:w-48 text-left">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nombre del producto
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        <a href="#" className="hover:underline">
                          {product.name}
                        </a>
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 md:flex-1 lg:w-auto text-left">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Categoría
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {product.categoryDto.name}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/5 md:flex-1 lg:w-auto text-left">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Precio
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {product.price.toFixed(2).replace(".", ",")}
                        {" €"}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 sm:flex-1 lg:w-auto text-left">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Estado
                      </dt>
                      <dd
                        className={`mt-1.5 inline-flex shrink-0 rounded bg-${color}-100 px-2.5 py-0.5 text-xs font-medium text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`}
                      >
                        <Badge color={color} className="text-xs rounded">
                          {label}
                        </Badge>
                      </dd>
                    </dl>
                  </div>
                </button>
              );
            })
          ) : (
            <p>No hay productos para mostrar.</p>
          )}
          <div className="flex justify-center mt-20">
            <Paginator
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};