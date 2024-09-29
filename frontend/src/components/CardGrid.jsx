import React from "react";
import { list } from "../data/list";
import { CardItem } from "./CardItem.jsx";

export const CardGrid = ({ productList }) => {
  
  const printData = () => {
    productList.map((product, index) => (<>{console.log("image => " )}</>));
  }
  
  return (
    
     <div className="grid grid-cols-3 gap-12 max-w-screen-lg mx-auto mt-20">
       {productList.map((product, index) => (<> 
         <CardItem key={index} product={product} /></>
       ))}

     </div>
  );
};
