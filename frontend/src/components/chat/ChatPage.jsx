import React, { useState, useEffect, useRef, useContext } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./styles.css";
import { LoginContext } from "../context/LoginContext";
import { useParams } from "react-router-dom";
import useMessageStore from "../store/useMessageStore";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useContext(LoginContext);
  const { id } = useParams();
  const { messages, addMessage, setMessages } = useMessageStore();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat");
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        console.log("Connected to WebSocket");
        client.subscribe("/topic/messages", (msg) => {
          const newMessage = JSON.parse(msg.body);
          addMessage(newMessage);
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
  }, []); // <-- Asegúrate de que este hook solo se ejecute una vez al montar el componente

  useEffect(() => {
    // Scroll to the bottom of the messages list when a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected && message.trim()) {
      const chatMessage = {
        senderId: user.id,
        receiverId: id,
        content: message,
        timestamp: new Date().toISOString(),
      };
      console.log("Sending message:", JSON.stringify(chatMessage));
      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
      setMessage(""); // Clear the message input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full mt-2 space-x-3 max-w-xs ${
                msg.senderId === user.id ? "ml-auto justify-end" : ""
              }`}
            >
              {msg.senderId !== user.id && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
              )}
              <div>
                <div
                  className={`p-3 rounded-lg ${
                    msg.senderId === user.id
                      ? "bg-accent-dark text-white rounded-l-lg rounded-br-lg"
                      : "bg-gray-300 rounded-r-lg rounded-bl-lg"
                  }`}
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
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-gray-300 p-4 flex flex-row space-x-2">
          <input
            className="flex items-center h-10 w-full rounded px-3 text-sm mt-2"
            type="text"
            placeholder="Type your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-600 text-white p-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
