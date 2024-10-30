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
import OfferStepper from "../form/OfferStepper";
import OfferDetailsModal from "../modals/OfferDetailsModal.jsx"; 
import { createOffer } from "../../backend/offerService";
import { Modal } from "@mui/material";

const ChatPage = ({ setSelectedConversationId, selectedConversationId }) => {
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const { user, token } = useContext(LoginContext);
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
  const [showOfferStepper, setShowOfferStepper] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferDetails, setShowOfferDetails] = useState(false);

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

  const sendChatMessage = (chatMessage) => {
    const headers = {
      Authorization: `Bearer ${user.token}`, // Include the authentication token
      "Content-Type": "application/json",
    };
    stompClient.send("/app/sendMessage", headers, JSON.stringify(chatMessage));
    sendMessage(chatMessage);
  };

  const handleSendMessage = () => {
    if (
      stompClient &&
      stompClient.connected &&
      message.trim() &&
      selectedConversationId
    ) {
      const receiverId = selectedConversationId
        .split("-")
        .find((id) => id !== user.id.toString());

      const chatMessage = {
        senderId: user.id,
        receiverId: receiverId,
        content: message,
        timestamp: new Date().toISOString(),
        type: "TEXT",
      };

      sendChatMessage(chatMessage);
      setMessage("");
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleConversationClick = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setShowOfferDetails(true);
  };

  const handleOfferFinalize = (offerDetails) => {
    console.log("Offer finalized:", offerDetails.offerDetails);
    if (stompClient && stompClient.connected && selectedConversationId) {
      const receiverId = selectedConversationId
        .split("-")
        .find((id) => id !== user.id.toString());

      const offerDto = {
        buyerId: receiverId,
        amount: offerDetails.offerDetails.desiredPrice,
        items: offerDetails.offerDetails.products ? offerDetails.offerDetails.products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        })) : [],
      };

      console.log("Offer DTO:", offerDto);

      createOffer(
        user.id,
        offerDto,
        (createdOffer) => {
          const chatMessage = {
            senderId: user.id,
            receiverId: receiverId,
            content: offerDetails.message,
            timestamp: new Date().toISOString(),
            type: "OFFER",
            offer: createdOffer,
            token: token,
          };

          console.log("token:" + token);
          sendChatMessage(chatMessage);
          setShowOfferStepper(false);
          console.log("Se creo" + createdOffer);
        },
        (errors) => {
          console.error("Error creating offer:", errors);
        }
      );
    }
  };

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
                <div>
                  {msg.type === "OFFER" ? (
                    <button
                      className="p-3 bg-blue-500 text-white rounded"
                      onClick={() => handleOfferClick(msg.offer)}
                    >
                      View Offer
                    </button>
                  ) : (
                    <div
                      className={`p-3 ${
                        msg.senderId === user.id
                          ? "bg-accent-dark text-white rounded-l-lg rounded-br-xl"
                          : "bg-gray-200 rounded-r-lg rounded-bl-xl"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  )}
                  <span className="text-xs text-gray-500 leading-none">
                    {getTimeDifference(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No messages available</p>
          )}
          <div ref={messagesEndRef} />
        </div>
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
            <button
              className="absolute right-20 text-accent-darker p-1"
              onClick={() => setShowOfferStepper(true)}
            >
              Send Offer
            </button>
          </div>
        </div>
        <Modal open={showOfferStepper} onClose={() => setShowOfferStepper(false)}>
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-lg">
              <OfferStepper onOfferFinalize={handleOfferFinalize} />
            </div>
          </div>
        </Modal>
        <OfferDetailsModal
          offerId={selectedOffer?.id}
          show={showOfferDetails}
          handleClose={() => setShowOfferDetails(false)}
        />
      </div>
    </div>
  );
};

export default ChatPage;