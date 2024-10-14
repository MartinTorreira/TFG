import React, { useContext, useEffect } from "react";
import usePurchasesStore from "../store/usePurchasesStore";
import { UserPurchaseList } from "./UserPurchaseList";
import { LoginContext } from "../context/LoginContext";

const UserPurchasesPage = () => {
  const { user } = useContext(LoginContext);
  const { purchases, loadPurchases } = usePurchasesStore();

  useEffect(() => {
    loadPurchases(user.id);
  }, [loadPurchases, user]);

  return (
    <div className="mt-10 lg:w-4/5 mx-auto items-center">
      <UserPurchaseList purchases={purchases} />
    </div>
  );
};

export default UserPurchasesPage;
