import { ShoppingBagIcon } from "../../icons/ShoppingBagIcon";
import { MoneyIcon } from "../../icons/MoneyIcon";
import { ReceiptIcon } from "../../icons/ReceiptIcon";
import React, { useContext } from "react";
import { LoginContext } from "../context/LoginContext";
import { RatingComponent } from "../RatingComponent.jsx";

const Stats = () => {
  const { user } = useContext(LoginContext);

  return (
    <div className="flex flex-col justify-center items-center mt-20">

      <div className="flex flex-col items-center mx-auto">
        <h1 className="flex text-4xl font-semibold mb-4">Tu valoración</h1>
        <RatingComponent />
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center w-full lg:w-2/3 lg:w-1/2 space-y-6 lg:space-y-0 lg:space-x-6 p-10 mx-auto text-2xl font-medium">
        <div className="flex flex-row border border-gray-300 p-8 rounded-lg w-full lg:w-1/3 justify-center items-center gap-x-2">
          <span>Compras</span>
          <ShoppingBagIcon />
        </div>

        <div className="flex flex-row border border-gray-300 p-8 rounded-lg w-full lg:w-1/3 justify-center items-center gap-x-2">
          <span>Ventas</span>
          <MoneyIcon />
        </div>

        <div className="flex flex-row border border-gray-300 p-8 rounded-lg w-full lg:w-1/3 justify-center items-center gap-x-2">
          <span>Tus artículos</span>
          <ReceiptIcon />
        </div>
      </div>
    </div>
  );
};

export default Stats;
