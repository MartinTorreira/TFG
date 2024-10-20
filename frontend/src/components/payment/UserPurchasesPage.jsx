// src/components/UserPurchasesPage.js
import React, { useContext, useEffect } from "react";
import usePurchasesStore from "../store/usePurchasesStore";
import { UserPurchaseList } from "./UserPurchaseList";
import { LoginContext } from "../context/LoginContext";
import { NotFound } from "../../icons/NotFound";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserPurchasesPage = () => {
  const { user, token } = useContext(LoginContext);
  const { purchases, loadPurchases } = usePurchasesStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("../users/login");
    } else {
      loadPurchases(user.id);
    }
  }, [loadPurchases, user, token, navigate]);

  const handleRefund = async (captureId, amount) => {
    console.log("Refunding purchase with captureId:", captureId);
    try {
      const response = await fetch("http://localhost:8080/purchase/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          captureId: captureId,
          amount: amount,
          currency: "EUR",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      toast.success("Reembolso realizado correctamente");
    } catch (err) {
      console.error("Error processing refund:", err);
      toast.error("Error al procesar el reembolso");
    }
  };

  return (
    <>
      {purchases.length > 0 ? (
        <div className="mt-10 lg:w-2/3 mx-auto items-center px-20">
          <UserPurchaseList purchases={purchases} onRefund={handleRefund} />
        </div>
      ) : (
        <div className="flex flex-col space-y-10 items-center justify-center w-full py-20">
          <h1 className="text-5xl font-semibold text-gray-400">
            No tienes compras registradas
          </h1>
          <span>
            <NotFound size={90} />
          </span>
        </div>
      )}
    </>
  );
};

export default UserPurchasesPage;
