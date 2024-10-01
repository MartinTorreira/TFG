import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ImageSlider } from "./ImageSlider.jsx";
import { getProductById } from "../../backend/productService.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const onSuccess = (data) => {
    setProduct(data);
  };

  const onErrors = (error) => {
    console.log("Error", error);
  };

  useEffect(() => {
    const productId = Number(id);
    getProductById(productId, onSuccess, onErrors);
  }, [id, setProduct]);

  if (!product) return null;

  return (
    <section className="py-8 bg-transparent md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16 flex flex-col items-center">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <ImageSlider images={product.images} />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0 text-center lg:text-left">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {product.name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex sm:flex-col lg:flex-row">
              <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {product.price.toFixed(2).replace(".", ",")}
                {"€"}
              </p>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <a
                  href="#"
                  className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                >
                  345 Reviews
                </a>
              </div>
            </div>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:flex-col lg:flex-row sm:mt-8">
              <a
                href="#"
                title=""
                className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-all "
                role="button"
              >
                <svg
                  className="w-5 h-5 -ms-2 me-2"
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
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  />
                </svg>
                Añadir a favoritos
              </a>

              <a
                href="#"
                title=""
                className="text-white mt-4 sm:mt-0 bg-gray-800 hover:opacity-80 transition-all focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center"
                role="button"
              >
                <svg
                  className="w-5 h-5 -ms-2 me-2"
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
                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                  />
                </svg>
                Añadir al carro
              </a>
            </div>

            <hr className="my-6 md:my-8 border-gray-400" />

            <p className="mb-6 text-gray-800 ">{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
