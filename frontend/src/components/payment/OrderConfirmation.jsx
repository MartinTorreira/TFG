import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPurchaseByProductId } from "../../backend/paymentService";
import { getProductById } from "../../backend/productService";
import { toast } from "sonner";
import { getPlaceName } from "../../utils/MapUtils.js";
import { LoadScript } from "@react-google-maps/api";

export const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState("");
  const [product, setProduct] = useState(null);
  const [placeName, setPlaceName] = useState("");

  const onSuccess = (data) => {
    setProduct(data);
    fetchPlaceName(data.latitude, data.longitude);
  };

  const onErrors = (error) => {
    toast.error("error al cargar el producto");
  };

  useEffect(() => {
    if (id) {
      getPurchaseByProductId(
        Number(id),
        (purchase) => {
          setPurchase(purchase);
        },
        () => console.log("error"),
      );
    }
    const productId = Number(id);
    getProductById(productId, onSuccess, onErrors);
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const fetchPlaceName = async (lat, lng) => {
    try {
      const placeName = await getPlaceName(lat, lng);
      setPlaceName(placeName);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyC3DouYAkc3zzgNFpRiouHVw2fMChNSnJw">
      <section className="py-8 antialiased md:py-16 mt-10">
        <div className="mx-auto w-1/3 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
            ¡Gracias por su compra!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8 mt-6">
            Su pedido{" "}
            <span
              href="#"
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              #{purchase?.orderId}
            </span>{" "}
            ha sido recibido y será procesado. Ahora, el vendedor será
            notificado y deberá coordinar contigo los detalles para la entrega
            del producto. Gracias por usar nuestros servicios.
          </p>
          <div className="sm:space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-6 md:mb-8">
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Fecha
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {formatDate(purchase?.purchaseDate)}
              </dd>
            </dl>
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Método de pago
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {purchase.paymentMethod === "PAYPAL"
                  ? "PayPal"
                  : "Tarjeta de crédito"}
              </dd>
            </dl>
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Nombre
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {product?.name}
              </dd>
            </dl>
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Localización
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {placeName}
              </dd>
            </dl>
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Vendedor
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {product?.userDto.userName}
              </dd>
            </dl>
          </div>
          <div className="flex items-center space-x-4">
            <button
              href="#"
              className="text-white bg-accent-dark hover:bg-opacity-80 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-all"
            >
              Mis compras
            </button>
            <button
              onClick={() => navigate("../home")}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-opacity-80 "
            >
              Volver
            </button>
          </div>
        </div>
      </section>
    </LoadScript>
  );
};
