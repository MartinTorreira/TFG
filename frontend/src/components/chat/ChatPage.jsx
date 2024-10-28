import React, { useState, useEffect, useRef, useContext } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LoginContext } from "../context/LoginContext";
import useChatStore from "../store/useChatStore";
import { getUserById } from "../../backend/userService";

const ChatPage = () => {
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
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [receiverDetails, setReceiverDetails] = useState(null);

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
      },
    );

    setStompClient(client);

    return () => {
      client.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    };
  }, [addMessageToConversation]);

  useEffect(() => {
    if (selectedConversationId) {
      const [userId1, userId2] = selectedConversationId.split("-");
      loadMessages(userId1, userId2);
      const otherUserId = userId1 === user.id.toString() ? userId2 : userId1;
      getUserById(otherUserId, setReceiverDetails, (error) =>
        console.error("Error fetching user:", error),
      );
    }
  }, [selectedConversationId, user.id, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

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
    }
  };

  const handleConversationClick = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="flex h-[600px] mx-auto mt-20">
      <div className="w-1/4 p-4 bg-gray-100 h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Conversaciones</h2>
        {Object.keys(conversations).map((conversationId) => (
          <div
            key={conversationId}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            onClick={() => handleConversationClick(conversationId)}
          >
            <p className="font-medium">{conversationId}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center w-3/4 bg-white shadow-xl rounded-lg overflow-hidden h-full">
        <div className="flex flex-col flex-grow w-full p-4 overflow-auto">
          {selectedConversationId && conversations[selectedConversationId] ? (
            conversations[selectedConversationId].messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full mt-2 space-x-3 max-w-xs ${msg.senderId === user.id ? "ml-auto justify-end" : ""}`}
              >
                {msg.senderId !== user.id && (
                  <img
                    className="flex-shrink-0 h-10 w-10 rounded-full"
                    src={receiverDetails?.avatar}
                    alt="Receiver Avatar"
                  />
                )}
                <div>
                  <div
                    className={`p-3 rounded-lg ${msg.senderId === user.id ? "bg-accent-dark text-white rounded-l-lg rounded-br-lg" : "bg-gray-300 rounded-r-lg rounded-bl-lg"}`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 leading-none">
                    2 min ago
                  </span>
                </div>
                {msg.senderId === user.id && (
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                )}
              </div>
            ))
          ) : (
            <p>No messages available</p>
          )}
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
          <button
            className="bg-blue-600 text-white p-2 rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
