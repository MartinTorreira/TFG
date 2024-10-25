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
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../backend/userService.js";
import { purchaseStatusMap } from "../../utils/Qualities.js";
import { InfoIcon } from "../../icons/InfoIcon.jsx";
import { deleteNotification } from "../../backend/userService.js";

const NotificationPopover = () => {
  const {
    notifications = { content: [] },
    fetchNotifications,
    setNotifications,
    clearNotifications,
  } = useNotificationsStore();

  const { user } = useContext(LoginContext);
  const navigate = useNavigate();
  const [hasUnseenNotifications, setHasUnseenNotifications] = useState(false);

  const handleNotificationClick = async (path) => {
    await Promise.all(
      notifications.content.map(async (notification) => {
        await markAsRead(notification.id);
        await deleteNotification(notification.id);
      })
    );
  
    clearNotifications();
  
    navigate(path);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    const unseen =
      notifications &&
      notifications.content &&
      notifications.content.some((notification) => !notification.read);
    setHasUnseenNotifications(unseen);
  }, [notifications]);

  const formatMessage = (message) => {
    const orderIdRegex = /(#\d+)/g;
    const userRegex = /usuario (.+?)(?= (ha realizado|ha sido))/;

    purchaseStatusMap.forEach(({ value, label }) => {
      const statusRegex = new RegExp(value, "g");
      message = message.replace(
        statusRegex,
        `<strong class="font-medium">${label}</strong>`
      );
    });

    return message
      .replace(orderIdRegex, "<strong>$1</strong>")
      .replace(userRegex, 'usuario <span class="font-medium">$1</span>');
  };

  const getIconForStatus = (status) => {
    const statusObj = purchaseStatusMap.find((item) => item.value === status);
    return statusObj ? statusObj.icon : <InfoIcon size={6} />;
  };

  const getStatusFromMessage = (message) => {
    if (!message) return null;

    const statusMatch = purchaseStatusMap.find(({ value }) =>
      message.includes(value)
    );

    const purchaseMessageRegex = /El usuario .+ ha realizado una compra/g;
    if (purchaseMessageRegex.test(message)) {
      return null;
    }

    return statusMatch ? statusMatch.value : null;
  };

  const getColorForStatus = (status) => {
    const statusObj = purchaseStatusMap.find((item) => item.value === status);
    if (statusObj) {
      return `${statusObj.background}`;
    }
    //return "#F5F5F5";
    return "transparent";
  };

  const content = (
    <PopoverContent className="w-[450px]">
      {(titleProps) => (
        <div className="px-1 py-2 w-full">
          <p className="text-lg font-bold mb-4" {...titleProps}>
            Notificaciones
          </p>
          {notifications && notifications.content.length > 0 ? (
            notifications.content.map((notification, index) => {
              const message = notification.message;
              const status = getStatusFromMessage(message);
              const icon = getIconForStatus(status);
              const bgColor = getColorForStatus(status);

              return (
                <button
                  key={`${index}-${notification.id}`}
                  onClick={() => handleNotificationClick("../users/my-sales")}
                  className={`w-full text-left mt-2 p-2 py-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer flex items-center`}
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="mr-4">{icon}</div>
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(notification.message),
                      }}
                    />
                  </div>
                </button>
              );
            })
          ) : (
            <p>No tienes notificaciones.</p>
          )}
        </div>
      )}
    </PopoverContent>
  );

  return (
    <div className="flex flex-wrap">
      <Popover showArrow offset={10} placement="bottom-end" backdrop={"opaque"}>
        <PopoverTrigger>
          <Button color="mint" variant="" className="capitalize">
            {hasUnseenNotifications ? <NotificationOn /> : <NotificationOff />}
          </Button>
        </PopoverTrigger>
        {content}
      </Popover>
    </div>
  );
};

export default NotificationPopover;
