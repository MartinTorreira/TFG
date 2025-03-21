import React, { useContext, useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "../../icons/ShoppingBagIcon";
import usePurchasesStore from "../store/usePurchasesStore";
import useRatingsStore from "../store/useRatingStore";
import { LoginContext } from "../context/LoginContext";
import { DateIcon } from "../../icons/DateIcon";
import { Spinner } from "../../icons/Spinner";
import { purchaseStatusMap } from "../../utils/Qualities.js";
import { MoneyIcon } from "../../icons/MoneyIcon.jsx";
import { Check } from "../../icons/Check";
import { RatingComponent } from "../RatingComponent";
import { getSellerId } from "../../backend/userService";
import { UserRatingModal } from "../modals/UserRatingModal.jsx";
import { UserRefundModal } from "../modals/UserRefundModal.jsx";

export const UserPurchaseList = ({ onRefund, purchases }) => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { loadPurchases, updatePurchaseStatus } = usePurchasesStore();
  const { ratings, setRating } = useRatingsStore();
  const [loadingRefunds, setLoadingRefunds] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [sellerId, setSellerId] = useState({});

  const [selectedCaptureId, setSelectedCaptureId] = useState({});
  const [selectedAmount, setSelectedAmount] = useState({});
  const [purchaseId, setPurchaseId] = useState({});

  const handleNavigate = (id) => {
    navigate(`../purchase/order-confirmation/${id}/`);
  };

  useEffect(() => {
    purchases.forEach((purchase) => {
      getSellerId(
        purchase.id,
        (sellerId) => {
          setSellerId((prev) => ({ ...prev, [purchase.id]: sellerId }));
        },
        (err) => {
          console.log("Error fetching sellerid", err);
        }
      );
    });
  }, [purchases]);

  useEffect(() => {
    loadPurchases(user.id);
  }, [loadPurchases, user]);

  useEffect(() => {
    if (purchases?.length > 0) {
      const newStatusMap = {};
      purchases.forEach((purchase) => {
        const status = purchaseStatusMap.find(
          (item) => item.value === purchase.purchaseStatus
        );
        if (status) {
          newStatusMap[purchase.id] = status;
        } else {
          newStatusMap[purchase.id] = { label: "Desconocido", color: "gray" };
        }
      });
      setStatusMap(newStatusMap);
    }
  }, [purchases]);

  const handleRate = async (purchaseId, newValue) => {
    try {
      getSellerId(
        purchaseId,
        (sellerId) => {
          setRating(sellerId, newValue);
        },
        (err) => {
          console.log("Error", err);
        }
      );
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleOpenRefundModal = async (captureId, amount, purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setSelectedAmount(amount);
    setSelectedCaptureId(captureId);
    setRefundModalOpen(true);
  };

  const handleCloseRefundModal = () => {
    setRefundModalOpen(false);
  };

  const handleOpenModal = (purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPurchaseId(null);
  };

  const handleConfirmRefundModal = async (captureId, amount, purchaseId) => {
    if (selectedPurchaseId && selectedAmount && selectedCaptureId) {
      setLoadingRefunds((prev) => ({ ...prev, [selectedPurchaseId]: true }));

      try {
        await onRefund(selectedCaptureId, selectedAmount, selectedPurchaseId);
        loadPurchases(user.id);
        updatePurchaseStatus(selectedPurchaseId, "REFUNDED");
      } catch (error) {
        console.error("Error during refund:", error);
      } finally {
        setLoadingRefunds((prev) => ({ ...prev, [selectedPurchaseId]: false }));
      }
    }
    handleCloseRefundModal();
  };

  const handleConfirmModal = () => {
    if (selectedPurchaseId) {
      updatePurchaseStatus(selectedPurchaseId, "COMPLETED");
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex flex-row items-left space-x-4 mb-10 mt-16">
        <span>
          <ShoppingBagIcon size={40} />
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
          Mis compras
        </h2>
      </div>
      <section className="w-full mx-auto rounded-lg antialiased p-2 bg-gray-50">
        <div className="max-w-full px-4 sm:px-8 sm:space-y-10 lg:space-y-2">
          {purchases &&
            purchases.map((purchase, index) => (
              <div key={purchase.orderId} className="">
                <div
                  className={`${
                    index + 1 !== purchases.length
                      ? "border-b border-gray-400 "
                      : ""
                  }`}
                >
                  <UserRatingModal
                    open={modalOpen}
                    handleClose={handleCloseModal}
                    handleConfirm={handleConfirmModal}
                    sellerId={sellerId[selectedPurchaseId]}
                  />
                  <UserRefundModal
                    open={refundModalOpen}
                    handleClose={handleCloseRefundModal}
                    handleConfirm={handleConfirmRefundModal}
                    captureId={purchase.captureId}
                    amount={purchase.amount}
                    purchaseId={purchase.id}
                  />
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-center lg:text-left py-4 space-y-10 lg:space-y-0 lg:space-x-4">
                    <div className="flex flex-col space-y-1 items-center lg:items-start lg:flex-1">
                      <span className="text-xs font-semibold text-gray-500">
                        ID de compra
                      </span>
                      <button
                        onClick={() => handleNavigate(purchase.id)}
                        className="text-sm font-semibold text-gray-900 hover:underline dark:text-white"
                      >
                        #{purchase.orderId}
                      </button>
                    </div>

                    <div className="flex flex-col items-center lg:items-start space-y-1 lg:flex-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Fecha
                      </span>
                      <div className="flex gap-2 items-center">
                        <DateIcon />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                          {formatDate(purchase.purchaseDate, "-")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 lg:flex-1 items-center lg:items-start">
                      <span className="text-xs font-semibold text-gray-500">
                        Precio total
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
                        {purchase.amount.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>

                    <div className="flex flex-col items-center lg:items-start space-y-1 lg:flex-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Estado
                      </span>
                      <span
                        className={`flex flex-row w-full space-x-1 md:w-auto rounded-full border text-xs border-${
                          statusMap[purchase.id]?.color
                        } bg-${statusMap[purchase.id]?.color}-200 text-${
                          statusMap[purchase.id]?.color
                        }-900 text-center py-0.5 px-1`}
                      >
                        <span>{statusMap[purchase.id]?.label}</span>
                        <span>{statusMap[purchase.id]?.icon}</span>
                      </span>
                    </div>

                    <div className="space-y-10">
                      <div className="flex flex-col space-y-2 lg:flex-1 items-center lg:items-start">
                        {!purchase.isRefunded && (
                          <div className="flex flex-row w-full">
                            <button
                              onClick={() =>
                                handleOpenRefundModal(
                                  purchase.captureId,
                                  purchase.amount,
                                  purchase.id
                                )
                              }
                              className="w-full text-xs text-red-900/80 font-bold hover:opacity-80 transition-all border border-red-50 p-2 rounded-md disabled:bg-gray-200 disabled:border-gray-200 disabled:opacity-40 disabled:text-gray-500 hover:bg-red-100/20"
                              disabled={
                                purchase.purchaseStatus !== "PENDING" ||
                                loadingRefunds[purchase.id]
                              }
                            >
                              {loadingRefunds[purchase.id] ? (
                                <div className="flex items-center justify-center space-x-1">
                                  <Spinner size={16} />{" "}
                                  <span>Procesando...</span>
                                </div>
                              ) : (
                                <div className="flex flex-row items-center space-x-1 justify-center">
                                  <span>Solicitar reembolso</span>
                                  <span>
                                    <MoneyIcon size={4} />
                                  </span>
                                </div>
                              )}
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => handleOpenModal(purchase.id)}
                          disabled={purchase.purchaseStatus !== "PENDING"}
                          type="button"
                          className="w-full text-gray-700 text-xs font-bold rounded-md px-2 hover:opacity-80 transition-all sm:mb-10 lg:mb-0 border border-gray-200 p-2 disabled:bg-gray-200 disabled:border-gray-200 disabled:opacity-40 disabled:text-gray-500 hover:bg-accent-light/20"
                        >
                          <div className="flex flex-row items-center space-x-1 ">
                            <span>Marcar como recibido</span>
                            <span
                              className={`${
                                purchase.purchaseStatus !== "PENDING"
                                  ? "text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              <Check size={4} color={"text-gray-700"} />
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};