import React, { useState, useEffect, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../backend/productService";
import { LoginContext } from "../context/LoginContext";
import { toast } from "sonner";
import { useProductStore } from "../store/useProductStore.js";

const PayPalPayment = () => {
  const { id } = useParams();
  const { user } = useContext(LoginContext);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  let purchaseId = "";

  const handleExitPurchase = () => {
    console.log("PURCHASEID" + purchaseId);
    fetchProducts(); // TODO - Hacer una función para quirar el producto de la lista sin borrarlo
    navigate(`../purchase/orderSummary/${purchaseId}/`);
    toast.success("Compra realizada correctamente");
  };

  const createOrder = async (data, actions) => {
    if (!product) {
      setError(new Error("Product not loaded"));
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: product.userDto.id,
          productIds: [product.id],
          quantities: [1],
          amount: product.price,
          currency: "EUR",
          paymentMethod: "paypal",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const order = await response.json();

      if (order.approvalUrl) {
        const urlParams = new URLSearchParams(
          new URL(order.approvalUrl).search,
        );
        console.log("aaaa" + order.purchase.id);
        purchaseId = order.purchase.id;
        return urlParams.get("token");
      } else {
        throw new Error("Approval URL not found");
      }
    } catch (err) {
      setError(err);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await fetch(
        `http://localhost:8080/purchase/execute?orderId=${data.orderID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userId: user.id,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      handleExitPurchase();
    } catch (err) {
      setError(err);
    }
  };

  const onSuccess = (data) => {
    setProduct(data);
  };

  const onErrors = (error) => {
    console.log("Error fetching product" + error);
  };

  useEffect(() => {
    const productId = Number(id);
    getProductById(productId, onSuccess, onErrors);
  }, [id]);

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AfAuDL8Y-RaJ90kX1mAJfQy2mGGefCc1ovLwoVE74NKZCEmie7xnfiwP6om2MnAwAm0YhB6_zTfJSfWa",
        currency: "EUR",
      }}
    >
      <div className="flex mt-20 justify-center min-h-screen ">
        <div className="flex flex-col w-full items-center space-y-10 ">
          {error && <div>Error: {error.message}</div>}
          {product && (
            <div>
              <h1 className="text-2xl font-semibold mb-10 text-center">
                Seleccionar método de pago
              </h1>
              <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
