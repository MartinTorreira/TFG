import React, { useState, useEffect, useRef, useContext } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./styles.css";
import { LoginContext } from "../context/LoginContext";
import useChatStore from "../store/useChatStore";
import { getUserById } from "../../backend/userService";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useContext(LoginContext);
  const { id: receiverId } = useParams();
  const { conversations, addMessageToConversation, loadMessages, loadInitialMessages, sendMessage } = useChatStore();
  const [receiverDetails, setReceiverDetails] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadInitialMessages(user.id);
    }
  }, [user?.id, loadInitialMessages]);

  useEffect(() => {
    if (receiverId) {
      getUserById(receiverId, (data) => {
        setReceiverDetails(data);
      }, (error) => console.error("Error fetching user:", error));
    }
  }, [receiverId]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat");
    const client = Stomp.over(() => socket);

    client.connect({}, () => {
      client.subscribe("/topic/messages", (msg) => {
        const newMessage = JSON.parse(msg.body);
        addMessageToConversation(newMessage.receiverId, newMessage);
      });
    }, (error) => {
      console.error("Error connecting to WebSocket:", error);
    });

    setStompClient(client);

    return () => {
      client.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    };
  }, [addMessageToConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSendMessage = () => {
    if (stompClient && stompClient.connected && message.trim() && receiverDetails?.id) {
      const chatMessage = {
        senderId: user.id,
        receiverId: receiverDetails.id,
        content: message,
        timestamp: new Date().toISOString(),
      };

      if (stompClient.connected) {
        stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
        sendMessage(chatMessage).catch((error) => {
          console.error("Error sending message:", error);
        });
        setMessage("");
      } else {
        console.error("Cannot send message: WebSocket not connected.");
      }
    } else {
      console.error("Cannot send message: receiverDetails is null or other conditions not met");
    }
  };

  const handleNavigateChat = (receiverId) => {
    if (receiverId) {
      loadMessages(user.id, receiverId);
    } else {
      console.error("Cannot load messages: receiverId is undefined");
    }
  };

  return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-1/4 p-4 bg-gray-100 h-3/4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Conversaciones</h2>
          {Object.keys(conversations).map((receiverId) => (
              <div
                  key={receiverId}
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                  onClick={() => handleNavigateChat(receiverId)}
              >
                <p className="font-medium">{receiverId}</p>
              </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center w-1/2 bg-white shadow-xl rounded-lg overflow-hidden h-3/4">
          <div className="flex flex-col flex-grow w-full p-4 overflow-auto">
            {conversations[receiverId] && conversations[receiverId].messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex w-full mt-2 space-x-3 max-w-xs ${msg.senderId === user.id ? "ml-auto justify-end" : ""}`}
                >
                  {msg.senderId !== user.id && (
                      <img className="flex-shrink-0 h-10 w-10 rounded-full" src={receiverDetails?.avatar} alt="Receiver Avatar" />
                  )}
                  <div>
                    <div className={`p-3 rounded-lg ${msg.senderId === user.id ? "bg-accent-dark text-white rounded-l-lg rounded-br-lg" : "bg-gray-300 rounded-r-lg rounded-bl-lg"}`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                  </div>
                  {msg.senderId === user.id && (
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                  )}
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="bg-gray-300 p-4 flex flex-row space-x-2 w-full">
            <input
                className="flex items-center h-10 w-full rounded px-3 text-sm"
                type="text"
                placeholder="Type your message…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-blue-600 text-white p-2 rounded" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatPage;