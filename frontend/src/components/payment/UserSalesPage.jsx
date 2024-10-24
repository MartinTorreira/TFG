import React, { useContext, useEffect } from "react";
import useSalesStore from "../store/useSalesStore";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { UserSalesList } from "./UserSalesList";
import { NotFound } from "../../icons/NotFound";


const UserSalesPage = () => {
  const { loadSales, sales } = useSalesStore();
  const { user, token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (!token){
      navigate("../users/login");
    }else {
      loadSales(user.id);
    }

  }, [user.id, loadSales]);

  return (
    <>
      {sales.length > 0 ? (
        <div className="mt-10 lg:w-2/3 mx-auto items-center px-20">
          <UserSalesList sales={sales} />
        </div>
      ) : (
        <div className="flex flex-col space-y-10 items-center justify-center w-full py-20 mt-10">
          <h1 className="text-5xl font-semibold text-gray-400">
            No tienes ventas registradas
          </h1>
          <span>
            <NotFound size={90} />
          </span>
        </div>
      )}
    </>
  );
};

export default UserSalesPage;
