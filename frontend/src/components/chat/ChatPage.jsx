import React, { useState, useEffect, useRef, useContext } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LoginContext } from "../context/LoginContext";
import useChatStore from "../store/useChatStore";
import { getUserById } from "../../backend/userService";
import { IoMdSend } from "react-icons/io";
import { getTimeDifference } from "../../utils/formatDate";
import dayjs from "dayjs";
import "dayjs/locale/es";
import OfferStepper from "../form/OfferStepper.jsx";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useOfferStore from "../store/useOfferStore";
import { v4 as uuidv4 } from "uuid";

const ChatPage = ({ setSelectedConversationId, selectedConversationId }) => {
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useContext(LoginContext);
  const {
    conversations,
    addMessageToConversation,
    loadMessages,
    loadInitialMessages,
    sendMessage,
  } = useChatStore();
  const [userDetails, setUserDetails] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeNow, setTimeNow] = useState(dayjs());
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const navigate = useNavigate();
  const setOffer = useOfferStore((state) => state.setOffer); // Obtener la función para guardar la oferta en Zustand

  useEffect(() => {
    if (user?.id) {
      loadInitialMessages(user.id);
    }
  }, [user?.id, loadInitialMessages]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat");
    const client = Stomp.over(() => socket);

    client.connect(
      {},
      () => {
        client.subscribe("/topic/messages", (msg) => {
          const newMessage = JSON.parse(msg.body);
          const conversationId = [newMessage.senderId, newMessage.receiverId]
            .sort()
            .join("-");
          addMessageToConversation(conversationId, newMessage);
        });
      },
      (error) => {
        console.error("Error connecting to WebSocket:", error);
      }
    );

    setStompClient(client);

    return () => {
      client.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    };
  }, [addMessageToConversation]);

  useEffect(() => {
    const fetchDetails = async () => {
      const userIds = Object.keys(conversations).flatMap((conversationId) =>
        conversationId.split("-").filter((id) => id !== user.id.toString())
      );
      const uniqueUserIds = [...new Set(userIds)];
      const detailsPromises = uniqueUserIds.map(
        (userId) =>
          new Promise((resolve, reject) => {
            getUserById(userId, resolve, reject);
          })
      );
      const details = await Promise.all(detailsPromises);
      const detailsMap = details.reduce((acc, detail) => {
        acc[detail.id] = detail;
        return acc;
      }, {});
      setUserDetails(detailsMap);
    };

    if (Object.keys(conversations).length > 0) {
      fetchDetails();
    }
  }, [conversations, user.id]);

  useEffect(() => {
    if (selectedConversationId) {
      const [userId1, userId2] = selectedConversationId.split("-");
      loadMessages(userId1, userId2);
      getUserById(
        user.id,
        (data) => {
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            [user.id]: data,
          }));
        },
        (error) => console.error("Error fetching user:", error)
      );
    }
  }, [selectedConversationId, user.id, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(dayjs());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (
      stompClient &&
      stompClient.connected &&
      message.trim() &&
      selectedConversationId
    ) {
      const chatMessage = {
        senderId: user.id,
        receiverId: selectedConversationId
          .split("-")
          .find((id) => id !== user.id.toString()),
        content: message,
        timestamp: new Date().toISOString(),
      };

      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
      sendMessage(chatMessage);
      setMessage("");
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleConversationClick = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const openOfferModal = () => setIsOfferModalOpen(true);
  const closeOfferModal = () => setIsOfferModalOpen(false);

  const handleOfferFinalize = (offerDetails) => {
    if (stompClient && stompClient.connected && selectedConversationId) {
      const offerId = uuidv4(); // Generate a unique ID for the offer
      offerDetails.id = offerId; // Assign the ID to the offer details
      setOffer(offerDetails); // Save the offer in Zustand

      const chatMessage = {
        senderId: user.id,
        receiverId: selectedConversationId
          .split("-")
          .find((id) => id !== user.id.toString()),
        content: `Haz clic <a href="#" onClick="handleOfferClick(event, '${offerId}')">aquí</a> para ver la oferta`,
        timestamp: new Date().toISOString(),
        type: "OFFER",
        offerId, // Agregar el ID de la oferta al mensaje
      };

      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
      sendMessage(chatMessage);
      setIsOfferModalOpen(false);
    }
  };

  const handleOfferClick = (event, offerId) => {
    event.preventDefault();
    // Obtener los detalles de la oferta utilizando el ID
    const offer = useOfferStore.getState().offer;

    if (offer && offer.id === offerId) {
      proceedToOrderSummary(offer);
    } else {
      // Aquí podrías implementar una lógica para buscar la oferta en tu estado
      // o realizar una llamada a la API para obtener los detalles de la oferta
      console.error("Offer not found or does not match the offerId");
    }
  };

  const proceedToOrderSummary = (offerDetails) => {
    console.log("llego aqui");
    if (offerDetails) {
      navigate("/product/order-summary", { state: { offerDetails } });
    } else {
      console.error("Offer details are null");
    }
  };

  // const handleOfferClick = (event, offerId) => {
  //   event.preventDefault();
  //   const offer = useOfferStore.getState().offer;
  //   if (offer && offer.id === offerId) {
  //     proceedToOrderSummary(offer);
  //   } else {
  //     console.error("Offer not found or does not match the offerId");
  //   }
  // };

  return (
    <div className={`flex h-[650px] ${isAnimating ? "slide-up" : ""}`}>
      <div className="w-2/5 p-4 bg-gray-100 h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-8">Chats</h2>
        {Object.keys(conversations).map((conversationId) => {
          const [userId1, userId2] = conversationId.split("-");
          const otherUserId =
            userId1 === user.id.toString() ? userId2 : userId1;
          const lastMessage =
            conversations[conversationId].messages.slice(-1)[0];
          const userDetail = userDetails[otherUserId];

          return (
            <div
              key={conversationId}
              className="flex flex-row cursor-pointer hover:bg-gray-200 p-3 -ml-2 border-y"
              onClick={() => handleConversationClick(conversationId)}
            >
              <img
                src={userDetail?.avatar}
                alt="Receiver Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col text-left text-sm ml-2">
                <p className=" font-medium">{userDetail?.userName}</p>
                <p className=" text-gray-600">
                  {lastMessage?.content || "No messages"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center w-3/4 bg-white overflow-hidden h-full">
        {selectedConversationId && (
          <div className="w-full p-4 border shadow-sm flex items-center">
            <img
              src={
                userDetails[
                  selectedConversationId
                    .split("-")
                    .find((id) => id !== user.id.toString())
                ]?.avatar || ""
              }
              alt="Receiver Avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <p className="font-medium">
              {
                userDetails[
                  selectedConversationId
                    .split("-")
                    .find((id) => id !== user.id.toString())
                ]?.userName
              }
            </p>
          </div>
        )}
        <div className="flex flex-col flex-grow w-full p-4 overflow-auto">
          {selectedConversationId && conversations[selectedConversationId] ? (
            conversations[selectedConversationId].messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full mt-2 space-x-3 max-w-xs ${
                  msg.senderId === user.id ? "ml-auto justify-end" : ""
                }`}
              >
                <div
                  className={`flex w-full mt-2 space-x-3 max-w-xs ${
                    msg.senderId === user.id ? "ml-auto justify-end" : ""
                  }`}
                >
                  <div>
                    <div
                      className={`p-3 ${
                        msg.senderId === user.id
                          ? "bg-accent-dark text-white rounded-l-lg rounded-br-xl"
                          : "bg-gray-200 rounded-r-lg rounded-bl-xl"
                      }`}
                    >
                      {msg.type === "OFFER" ? (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOfferClick(e, msg.offerId); // Usa el offerId directamente
                          }}
                          className="cursor-pointer text-blue-500 underline"
                        >
                          Haz clic aquí para ver la oferta
                        </a>
                      ) : (
                        <p
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 leading-none">
                      {getTimeDifference(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No messages available</p>
          )}

          <div ref={messagesEndRef} />
          <button
            onClick={openOfferModal}
            className="w-fit items-end bg-gray-100 rounded-full shadow text-sm text-accent-dark hover:bg-gray-50 hover:text-acccent border py-1.5 px-2"
          >
            Hacer una oferta
          </button>
        </div>
        <Modal open={isOfferModalOpen} onClose={closeOfferModal}>
          <Box
            sx={{
              width: 1000,
              height: 800,
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              mx: "auto",
              my: "10vh",
            }}
          >
            {offerDetails ? (
              <div>
                <h2>Oferta</h2>
                <p>
                  Precio Total:{" "}
                  {offerDetails.totalPrice
                    ? offerDetails.totalPrice.toFixed(2).replace(".", ",")
                    : "N/A"}{" "}
                  €
                </p>
                <p>
                  Precio Deseado:{" "}
                  {offerDetails.desiredPrice
                    ? offerDetails.desiredPrice.toFixed(2).replace(".", ",")
                    : "N/A"}{" "}
                  €
                </p>
                <ul>
                  {offerDetails.products > 0
                    ? offerDetails?.products?.map((product, index) => (
                        <li key={index}>
                          {product.name} - {product.quantity} unidades
                        </li>
                      ))
                    : null}
                </ul>
                <Button
                  onClick={() => proceedToOrderSummary(offerDetails)}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Proceder al pago
                </Button>
              </div>
            ) : (
              <OfferStepper onOfferFinalize={handleOfferFinalize} />
            )}
            <Button
              onClick={closeOfferModal}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
        <div className="bg-gray-100 py-2 w-full flex">
          <div className="flex px-4 items-center w-full relative">
            <input
              className="flex-grow p-2 pl-4 pr-8 text-sm focus:outline-none border border-accent-dark rounded"
              type="text"
              placeholder="Escribe un mensaje…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              className="absolute right-5 text-accent-darker p-1"
              onClick={handleSendMessage}
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
