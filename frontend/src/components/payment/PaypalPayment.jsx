import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalPayment = () => {
  const [error, setError] = useState(null);

  const createOrder = async (data, actions) => {
    return fetch("http://localhost:8080/payment/create", {
      // Updated URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: "69.00",
        currency: "EUR",
        method: "paypal",
        description: "Purchase description",
      }),
    })
      .then((response) => response.json())
      .then((order) => {
        if (order.approvalUrl) {
          const urlParams = new URLSearchParams(
            new URL(order.approvalUrl).search,
          );
          return urlParams.get("token"); // Return the EC token
        } else {
          throw new Error("Approval URL not found");
        }
      })
      .catch((err) => setError(err));
  };

  const onApprove = async (data, actions) => {
    return fetch(
      `http://localhost:8080/payment/execute?paymentId=${data.orderID}&PayerID=${data.payerID}`,
      {
        // Updated URL
        method: "POST",
      },
    )
      .then((response) => response.json())
      .then((details) => {
        alert("Transaction completed by " + details.payer.name.given_name);
      })
      .catch((err) => setError(err));
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AfAuDL8Y-RaJ90kX1mAJfQy2mGGefCc1ovLwoVE74NKZCEmie7xnfiwP6om2MnAwAm0YhB6_zTfJSfWa",
      }}
    >
      <div>
        {error && <div>Error: {error.message}</div>}
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
