import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams } from "react-router-dom";
import { getProductById } from "../../backend/productService";

const PayPalPayment = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

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
          buyerId: 1, // Replace with actual buyer ID
          sellerId: 2, // Replace with actual seller ID
          productIds: [product.id], // Replace with actual product IDs
          quantities: [1], // Replace with actual quantities
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
        return urlParams.get("token"); // Return the EC token
      } else {
        throw new Error("Approval URL not found");
      }
    } catch (err) {
      setError(err);
    }
  };

  const onApprove = async (data, actions) => {
    return fetch(
      `http://localhost:8080/purchase/execute?paymentId=${data.orderID}&PayerID=${data.payerID}`,
      {
        method: "POST",
      },
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((details) => {
        alert("Transaction completed by " + details.payer.name.given_name);
      })
      .catch((err) => {
        setError(err);
      });
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
