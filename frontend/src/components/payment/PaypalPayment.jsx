import React, { useState, useContext, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { toast } from "sonner";
import { useProductStore } from "../store/useProductStore.js";
import { updateProduct } from "../../backend/productService.js";
import useCartStore from "../store/useCartStore";
import { getItemByProductId } from "../../backend/shoppingCartService.js";
import usePurchasesStore from "../store/usePurchasesStore";

const PayPalPayment = () => {
  const location = useLocation();
  const { user } = useContext(LoginContext);
  const [products, setProducts] = useState(location.state?.products || []);
  const [isOffer, setIsOffer] = useState(location.state?.isOffer || false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { removeFromList } = useProductStore();
  const { removeFromCart } = useCartStore();
  const { addPurchase, updateCaptureId, deletePurchase } = usePurchasesStore();

  let purchaseId = "";

  useEffect(() => {
    logLocationState();
  }, [location.state]);

  const logLocationState = () => {
    if (location.state) {
      console.log("Location State:");
      Object.entries(location.state).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
    } else {
      console.log("No location state available");
    }
  };

  const removeFromCartList = async () => {
    products.forEach(async (product) => {
      try {
        await getItemByProductId(
          isOffer ? product.productId : product.id,
          (itemId) => removeFromCart(itemId),
          (error) => console.log("Error removing item from cart:", error),
        );
      } catch (error) {
        console.log("Error in handleDeleteClick:", error);
      }
    });
  };

  const handleExitPurchase = async () => {
    for (const product of products) {
      const updatedQuantity = product.originalQuantity - product.quantity;

      try {
        await updateProduct(product.id, {
          ...product,
          quantity: updatedQuantity,
        });

        if (updatedQuantity < 1) {
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
    if (products.length === 0) {
      setError(new Error("Products not loaded"));
      return;
    }

    const sellerId = products[0]?.userDto?.id;
    if (!sellerId) {
      setError(new Error("Seller ID is missing"));
      return;
    }

    const allSameSeller = products.every(
      (product) => product.userDto.id === sellerId,
    );

    if (!allSameSeller) {
      setError(new Error("All products must have the same seller"));
      return;
    }

    try {
      const totalAmount = products
        .reduce((total, product) => {
          const price = parseFloat(product.price) || 0;
          const quantity = parseInt(product.quantity) || 0;
          if (price < 0 || quantity < 0) {
            setError(new Error("Product price or quantity cannot be negative"));
            return total;
          }
          return total + price * quantity;
        }, 0)
        .toFixed(2);

      if (parseFloat(totalAmount) <= 0) {
        setError(new Error("Total amount must be greater than zero"));
        return;
      }

      const response = await fetch("http://localhost:8080/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: sellerId,
          purchaseItems: products.map((product) => ({
            productId: isOffer ? product.productId : product.id,
            quantity: product.quantity,
          })),
          amount: totalAmount,
          currency: "EUR",
          paymentMethod: "PAYPAL",
          purchaseStatus: "PENDING",
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

      const result = await response.json();
      const captureId = result.captureId;

      updateCaptureId(purchaseId, captureId, user.id);

      await removeFromCartList();
      handleExitPurchase();
    } catch (err) {
      console.log("LAST")
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
      <div className="flex mt-20 justify-center min-h-screen">
        <div className="flex flex-col w-full items-center space-y-10 ">
          {error && <div>Error: {error.message}</div>}
          {products.length > 0 && (
            <div>
              <h1 className="text-2xl font-semibold mb-10 text-center">
                Seleccionar método de pago
              </h1>
              <div className="w-screen flex justify-center">
                <div className="w-full max-w-md">
                  <PayPalButtons
                    fundingSource="paypal"
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onCancel={() => deletePurchase(purchaseId)}
                  />
                </div>
              </div>

              <div className="w-full flex justify-center mt-4">
                <div className="w-full max-w-md">
                  <PayPalButtons
                    fundingSource="card"
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onCancel={() => deletePurchase(purchaseId)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;