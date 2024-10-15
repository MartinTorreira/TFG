import React, { useContext, useEffect } from "react";
import usePurchasesStore from "../store/usePurchasesStore";
import { UserPurchaseList } from "./UserPurchaseList";
import { LoginContext } from "../context/LoginContext";
import { NotFound } from "../../icons/NotFound";

const UserPurchasesPage = () => {
  const { user } = useContext(LoginContext);
  const { purchases, loadPurchases } = usePurchasesStore();

  useEffect(() => {
    loadPurchases(user.id);
  }, [loadPurchases, user]);

  return (
    <>
      {purchases.length > 0 ? (
        <div className="mt-10 lg:w-3/4 mx-auto items-center">
          <UserPurchaseList purchases={purchases} />
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
