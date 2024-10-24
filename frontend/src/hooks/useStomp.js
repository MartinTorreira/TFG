import { useEffect, useState } from "react";
import StompService from "../socket/StompService.js";
import { config } from "../config/constants.js";

export default function useStomp(token) {
  const [isNotified, setIsNotified] = useState(() => false);
  const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);

  useEffect(() => {
    const connectToStomp = async () => {
      try {
        await StompService.connect();
        StompService.subscribe("/topic/notifications", (message) => {
          const parsedMessage = JSON.parse(message.body);
          const { userId } = parsedMessage;

          if (userId !== bearer.slice(-7)) {
            setIsNotified(true);
          }
        });
      } catch (e) {
        console.error("Error connecting to STOMP:", e);
      }
    };

    if (token != null) {
      connectToStomp();
    }

    return () => {
      // Limpiar recursos, desconectar el socket, etc., si es necesario
    };
  }, [token, isNotified, bearer]);

  return { isNotified };
}
