import React, { useContext, useEffect } from "react";
import useSalesStore from "../store/useSalesStore";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { UserSalesList } from "./UserSalesList";
import { NotFound } from "../../icons/NotFound";
import Paginator from "../Paginator.jsx";

const UserSalesPage = () => {
  const { loadSales, sales, page, setPage, totalPages } = useSalesStore();
  const { user, token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("../users/login");
    } else {
      loadSales(user.id, page);
    }
  }, [user.id, loadSales, page]);

  return (
    <>
      {sales.length > 0 ? (
        <div className="mt-10 2xl:w-2/3 sm:w-full mx-auto items-center">
          <UserSalesList sales={sales} />
          <div className="relative bottom-10 left-0 right-0 flex justify-center mb-4 mt-20">
            <Paginator
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
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
