import React from "react";
import { list } from "../data/list";
import { CardItem } from "./CardItem.jsx";

export const CardGrid = ({ children }) => {

    return(
        <div className="grid grid-cols-3 gap-12 max-w-screen-lg mx-auto mt-20">
            {list.map((item, index) => (
               <CardItem key={index} path={item.img}/>
            ))}
        </div>
    )

}