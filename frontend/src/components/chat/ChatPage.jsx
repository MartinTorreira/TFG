import React, { useState, useEffect, useRef, useContext } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LoginContext } from "../context/LoginContext";
import useChatStore from "../store/useChatStore";
import { getUserById } from "../../backend/userService";
import { getProductById } from "../../backend/productService";
import { IoMdSend } from "react-icons/io";
import { getTimeDifference } from "../../utils/formatDate";
import dayjs from "dayjs";
import "dayjs/locale/es";
import OfferStepper from "../form/OfferStepper";
import { Modal, Box } from "@mui/material";
import { createOffer, getOfferById } from "../../backend/offerService";
import { OfferIcon } from "../../icons/OfferIcon.jsx";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../Avatar.jsx";
import { RatingComponent } from "../RatingComponent.jsx";

const ChatPage = ({
  setSelectedConversationId,
  selectedConversationId,
  toggleChat,
}) => {
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
  const [productDetails, setProductDetails] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeNow, setTimeNow] = useState(dayjs());
  const [showOfferStepper, setShowOfferStepper] = useState(false);
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const navigate = useNavigate();

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
      Authorization: `Bearer ${user.token}`,
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

  const handleOfferFinalize = (offerDetails) => {
    console.log("Offer finalized:", offerDetails.offerDetails);
    if (stompClient && stompClient.connected && selectedConversationId) {
      const receiverId = selectedConversationId
        .split("-")
        .find((id) => id !== user.id.toString());

      const offerDto = {
        buyerId: receiverId,
        amount: offerDetails.offerDetails.desiredPrice,
        items: offerDetails.offerDetails.products
          ? offerDetails.offerDetails.products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            }))
          : [],
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

  const handleOfferClick = async (msg) => {
    console.log("Offer ID:", msg.offer.id);
    await getOfferById(
      msg.offer.id,
      (data) => setOfferDetails(data),
      (error) => console.error("Error fetching offer:", error)
    );

    // Fetch product details
    if (msg.offer.items) {
      const userId = msg.offer.buyerId;
      getUserById(
        userId,
        (data) => {
          setUserDetails(data);
        },
        (error) => console.error("Error fetching user:", error)
      );

      const productIds = msg.offer.items.map((item) => item.productId);
      productIds.forEach((productId) => {
        getProductById(
          productId,
          (data) => {
            setProductDetails((prevDetails) => ({
              ...prevDetails,
              [productId]: data,
            }));
          },
          (error) => console.error("Error fetching product:", error)
        );
      });
    }
    setShowOfferDetails(true);
  };

  const handleConversationClick = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const calculateInitialPrice = () => {
    return offerDetails?.items?.reduce((total, item) => {
      const product = productDetails[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleAcceptOffer = () => {
    if (!offerDetails || !productDetails) {
      console.error("Offer details or product details are missing");
      return;
    }

    const productsWithQuantities = offerDetails.items
      .map((item) => {
        const product = productDetails[item.productId];
        if (!product) {
          console.error(
            `Product details for productId ${item.productId} are missing`
          );
          return null;
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          userDto: product.userDto,
          name: product.name,
          price: product.price,
          images: product.images,
        };
      })
      .filter((item) => item !== null); 

    console.log("Navigating to OrderSummary with state:", {
      productList: productsWithQuantities,
      disableQuantities: true,
    });

    navigate("../product/order-summary", {
      state: { productList: productsWithQuantities, disableQuantities: true },
    });
    toggleChat();
    setShowOfferDetails(false);
  };

  return (
    <div
      className={`font-sans flex h-[650px] ${isAnimating ? "slide-up" : ""}`}
    >
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
                className={`flex mt-2 space-x-3 max-w-sm ${
                  msg.senderId === user.id ? "ml-auto justify-end" : ""
                }`}
              >
                <div className="max-w-[100%]">
                  {msg.type === "OFFER" ? (
                    <button
                      className="flex items-center text-sm text-left w-full bg-accent-light p-3 text-gray-800 hover:text-opacity-85 underline space-x-1 rounded-l-lg rounded-br-xl"
                      onClick={() => handleOfferClick(msg)}
                    >
                      <OfferIcon size={"20"} className="mr-2" />
                      <p>Haz click aquí para ver la oferta</p>
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
        <div className="bg-gray-100 py-2 w-full flex sm:flex-col 2xl:flex-row sm:space-y-2 2xl:space-y-0">
          <div className="flex items-center w-full relative flex-row mr-1">
            <input
              className="flex-grow p-2 pl-4 pr-8 text-sm focus:outline-none border border-accent-light rounded-full focus:placeholder:none"
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
              className="absolute right-2 text-accent-darker p-1"
              onClick={handleSendMessage}
            >
              <IoMdSend />
            </button>
          </div>
          <button
            className="2xl:w-1/3 sm:w-full sm:p-2 2xl:p-0 text-sm mr-5 rounded-full bg-white hover:opacity-80 transition-all border border-accent-light"
            onClick={() => setShowOfferStepper(true)}
          >
            <p className="text-gray-700">Hacer oferta</p>
          </button>
        </div>
        <Modal
          open={showOfferStepper}
          onClose={() => setShowOfferStepper(false)}
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-4 rounded shadow-lg 2xl:w-1/2 sm:w-11/12 h-2/3">
              <OfferStepper onOfferFinalize={handleOfferFinalize} />
            </div>
          </div>
        </Modal>
        <Modal
          open={showOfferDetails}
          onClose={() => setShowOfferDetails(false)}
        >
          <Box
            sx={{
              width: 800,
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              mx: "auto",
              my: "10vh",
            }}
          >
            <h2 className="flex flex-row justify-center space-x-3 items-center text-2xl font-semibold text-center mb-6 px-36">
              <p>Detalles de la oferta</p>
              <OfferIcon size={"28"} />
            </h2>
            <div className="flex flex-col gap-4 mb-6 mt-14">
              <div className="flex justify-between mb-6">
                <div className="flex flex-row items-center border border-gray-100 shadow-sm p-2 rounded-lg justify-center">
                  <Avatar
                    size={"10"}
                    className=""
                    imagePath={userDetails?.avatar}
                  />
                  <div className="flex flex-col gap-y-1">
                    <p className="text-sm">{userDetails?.userName}</p>
                    <RatingComponent size="small" rate={userDetails?.rate} />
                  </div>
                </div>
                <span className="text-lg font-medium text-right">
                  <p className="text-gray-500 line-through">
                    {calculateInitialPrice()?.toFixed(2).replace(".", ",")} €
                    <br />
                  </p>
                  <p className="text-2xl">
                    {offerDetails?.amount.toFixed(2).replace(".", ",")} €
                  </p>
                </span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-4">Productos</h3>
            <div className="space-y-4 items-center">
              {offerDetails?.items?.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-2 shadow flex items-center"
                >
                  <img
                    src={productDetails[item.productId]?.images[0]}
                    alt={productDetails[item.productId]?.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex flex-col">
                    <p className="mb-1 font-medium">
                      {productDetails[item.productId]?.name}
                    </p>
                    <p>x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row justify-end items-center mt-6 -mb-3 space-x-4">
              <div className="rounded-full border border-gray-200 bg-gray-200 text-gray-800 font-semibold py-1 px-3">
                <button onClick={() => setShowOfferDetails(false)}>
                  Cerrar
                </button>
              </div>
              <button
                onClick={() => {
                  handleAcceptOffer();
                  //   handleAcceptOffer();
                }}
                className="border border-accent-dark bg-accent-dark text-gray-100 font-semibold rounded-full py-1 px-3"
              >
                Aceptar
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ChatPage;
