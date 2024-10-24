import React, { useContext, useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import useNotificationsStore from "../store/useNotificationStore.js";
import { LoginContext } from "../context/LoginContext";
import { NotificationOn } from "../../icons/NotificationOn.jsx";
import { NotificationOff } from "../../icons/NotificationOff.jsx";
import { getProductById } from "../../backend/productService.js";
import { useNavigate } from "react-router-dom";

const NotificationPopover = () => {
  const { notifications, fetchNotifications } = useNotificationsStore();
  const { user } = useContext(LoginContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  }

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const productPromises = notifications.content.map(
          async (notification) => {
            return new Promise((resolve, reject) => {
              getProductById(
                notification.productId,
                (data) => resolve(data),
                (error) => reject("Error fetching product details:", error)
              );
            });
          }
        );

        const productsDetails = await Promise.all(productPromises);
        setProducts(productsDetails);
      } catch (error) {
        console.error("Error fetching notification details:", error);
      }
    };

    if (notifications.content) {
      fetchDetails();
    }
  }, [notifications]);

  const hasNotifications =
    notifications && notifications.content && notifications.content.length > 0;

  const content = (
    <PopoverContent className="w-[500px]">
      {(titleProps) => (
        <div className="px-1 py-2 w-full">
          <p className="text-lg font-bold text-foreground" {...titleProps}>
            Notificaciones
          </p>
          <div className="mt-4 flex flex-col gap-2 w-full text-md">
            {products.map((detail, index) => (
              <button
                key={index}
                onClick={() => handleNavigate("../users/my-sales")}
                className="p-2 py-4 border rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
              >
                El usuario <strong>{detail?.userDto?.userName} </strong>
                ha comprado una unidad de tu artículo{" "}
                <strong>{detail?.name}</strong>
              </button>
            ))}
          </div>
        </div>
      )}
    </PopoverContent>
  );

  return (
    <div className="flex flex-wrap">
      <Popover showArrow offset={10} placement="bottom" backdrop={"opaque"}>
        <PopoverTrigger>
          <Button color="" variant="" className="capitalize">
            {hasNotifications ? <NotificationOn /> : <NotificationOff />}
          </Button>
        </PopoverTrigger>
        {content}
      </Popover>
    </div>
  );
};

export default NotificationPopover;
