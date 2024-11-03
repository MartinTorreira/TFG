import React, { useContext, useEffect } from "react";
import usePurchasesStore from "../store/usePurchasesStore";
import useRatingsStore from "../store/useRatingStore";
import { UserPurchaseList } from "./UserPurchaseList";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotFound } from "../../icons/NotFound";

const UserPurchasesPage = () => {
  const { user, token } = useContext(LoginContext);
  const { purchases, loadPurchases, updateRefundStatus } = usePurchasesStore();
  const { ratings, fetchRatings } = useRatingsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("../users/login");
    } else {
      loadPurchases(user.id);
    }
  }, [loadPurchases, user, token, navigate]);

  useEffect(() => {
    if (purchases?.length > 0) {
      fetchRatings(purchases);
    }
  }, [purchases, fetchRatings]);

  const handleRefund = async (captureId, amount, productId) => {
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

      toast.success(
        "Tu reembolso está siendo procesado. Te informaremos cuando se haya completado"
      );
      updateRefundStatus(productId);
    } catch (error) {
      console.error("Error solicitando reembolso:", error);
      //toast.error("Hubo un problema procesando el reembolso");
    }
  };

  return (
    <>
      {purchases.length > 0 ? (
        <div className="mt-10 2xl:w-2/3 sm:w-full mx-auto items-center">
          <UserPurchaseList onRefund={handleRefund} purchases={purchases} />
        </div>
      ) : (
        <div className="flex flex-col space-y-10 items-center justify-center w-full py-20 mt-10">
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