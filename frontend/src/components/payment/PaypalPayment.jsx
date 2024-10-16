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

  const handleExitPurchase = async () => {
    for (const product of products) {
      const updatedQuantity = product.originalQuantity - product.quantity;
      console.log("EEEEAAA" + updatedQuantity);

      try {
        await updateProduct(product.id, {
          ...product,
          quantity: updatedQuantity, // Actualizamos la cantidad en el backend
        });

        if (updatedQuantity < 1) {
          console.log("ADSAAAAASDADSASDADÑÑÑÑÑÑ", updateProduct);
          removeFromList(product.id);
        }
      } catch (error) {
        console.error(`Error updating product ${product.id}:`, error);
      }
    }

    navigate(`../purchase/order-confirmation/${purchaseId}/`);
    toast.success("Compra realizada correctamente");
  };

  const createOrder = async (data, actions) => {
    try {
      const totalAmount = products
        .reduce((total, product) => {
          const price = parseFloat(product.price) || 0;
          const quantity = parseInt(product.quantity) || 0;
          if (price < 0 || quantity < 0) {
            setError(
              new Error("El precio o la cantidad no pueden ser negativos"),
            );
            return total;
          }
          return total + price * quantity;
        }, 0)
        .toFixed(2);

      if (parseFloat(totalAmount) <= 0) {
        setError(new Error("El importe total debe ser mayor que cero"));
        return;
      }

      const response = await fetch("http://localhost:8080/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: products[0].userDto.id,
          productIds: products.map((product) => product.id),
          quantities: products.map((product) => product.quantity),
          amount: totalAmount,
          currency: "EUR",
          paymentMethod: "paypal",
        }),
      });

      const order = await response.json();
      purchaseId = order.purchase.id;
      return new URLSearchParams(new URL(order.approvalUrl).search).get(
        "token",
      );
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
