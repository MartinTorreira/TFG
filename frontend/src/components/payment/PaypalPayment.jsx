import React, { useState, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { toast } from "sonner";
import { useProductStore } from "../store/useProductStore.js";
import { updateProduct } from "../../backend/productService.js";

const PayPalPayment = () => {
  const location = useLocation();
  const { user } = useContext(LoginContext);
  const [products, setProducts] = useState(location.state?.products || []);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { removeFromList } = useProductStore();
  let purchaseId = "";

  const handleExitPurchase = () => {
    products.forEach((product) => {
      const productDto = {
        ...product,
        quantity: product.quantity,
      };
      updateProduct(
        product.id,
        productDto,
        () => {
          console.log(`Producto ${product.id} actualizado correctamente.`);
        },
        (error) => {
          console.error(`Error actualizando producto ${product.id}:`, error);
        },
      );
    });
    navigate(`../purchase/order-confirmation/${purchaseId}/`);
    toast.success("Compra realizada correctamente");
  };

  const createOrder = async (data, actions) => {
    if (products.length === 0) {
      setError(new Error("Products not loaded"));
      return;
    }

    // Ensure all products have the same sellerId
    const sellerId = products[0].userDto.id;
    const allSameSeller = products.every(
      (product) => product.userDto.id === sellerId,
    );

    if (!allSameSeller) {
      setError(new Error("All products must have the same seller"));
      return;
    }

    console.log(
      "new quantities => " + products.map((product) => product.quantity),
    );

    try {
      const response = await fetch("http://localhost:8080/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: sellerId,
          productIds: products.map((product) => product.id),
          quantities: products.map((product) => product.quantity),
          amount: products
            .reduce(
              (total, product) => total + product.price * product.quantity,
              0,
            )
            .toFixed(2),
          currency: "EUR",
          paymentMethod: "paypal",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response from server:", text);
        throw new Error(text);
      }

      const order = await response.json();

      if (order.approvalUrl) {
        const urlParams = new URLSearchParams(
          new URL(order.approvalUrl).search,
        );
        console.log(
          "Order created successfully, purchase ID:",
          order.purchase.id,
        );
        purchaseId = order.purchase.id;
        return urlParams.get("token");
      } else {
        throw new Error("Approval URL not found");
      }
    } catch (err) {
      console.error("Error creating order:", err);
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
          {products.length > 0 && (
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
