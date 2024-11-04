import { create } from "zustand";
import {
  getMessagesBetweenUsers,
  sendMessage,
  getChatsForUser,
} from "../../backend/chatService";

const useChatStore = create((set) => ({
  conversations: {},

  addMessageToConversation: (conversationId, message) =>
    set((state) => {
      const conversation = state.conversations[conversationId] || {
        messages: [],
      };
      if (
        !conversation.messages.some(
          (msg) =>
            msg.timestamp === message.timestamp &&
            msg.content === message.content,
        )
      ) {
        const updatedConversations = {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            messages: [...conversation.messages, message],
          },
        };
        return { conversations: updatedConversations };
      }
      return state;
    }),

  addConversation: (conversationId) =>
    set((state) => {
      if (!state.conversations[conversationId]) {
        const updatedConversations = {
          ...state.conversations,
          [conversationId]: { messages: [] },
        };
        return { conversations: updatedConversations };
      }
      return state;
    }),
    loadMessages: async (userId1, userId2) => {
      if (!userId1 || !userId2) {
        console.error("User IDs must be defined");
        return;
      }
      console.log("LOAD MESSAGES=> ", userId1, userId2);
      try {
        const messages = await new Promise((resolve, reject) => {
          getMessagesBetweenUsers(userId1, userId2, resolve, reject);
        });
        const conversationId = [userId1, userId2].sort().join("-");
        if (messages.length > 0) {
          set((state) => ({
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...state.conversations[conversationId],
                messages,
              },
            },
          }));
        } else {
          console.log("No messages found between users");
          set((state) => ({
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...state.conversations[conversationId],
                messages: [],
              },
            },
          }));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No messages found between users");
          const conversationId = [userId1, userId2].sort().join("-");
          set((state) => ({
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...state.conversations[conversationId],
                messages: [],
              },
            },
          }));
        } else {
          console.error("Error loading messages:", error);
        }
      }
    },
    loadInitialMessages: async (userId) => {
      try {
        const initialMessages = await getChatsForUser(userId);
        if (Array.isArray(initialMessages) && initialMessages.length > 0) {
          const updatedConversations = initialMessages.reduce((acc, msg) => {
            const { senderId, receiverId } = msg;
            const conversationId = [senderId, receiverId].sort().join("-");
            if (!acc[conversationId]) {
              acc[conversationId] = { messages: [] };
            }
            acc[conversationId].messages.push(msg);
            return acc;
          }, {});
          set({ conversations: updatedConversations });
        } else {
          console.log("No initial messages found");
          set({ conversations: {} }); // Ensure conversations is an empty object if no messages are found
        }
      } catch (error) {
        if (error.message === "No messages found") {
          console.log("No messages found for user");
          set({ conversations: {} }); // Ensure conversations is an empty object if no messages are found
        } else {
          console.log("Error loading initial messages:", error);
        }
      }
    },
    
  sendMessage: async (messageDto) => {
    try {
      console.log("Sending message with token:", messageDto.token); // Log the token
      await new Promise((resolve, reject) => {
        fetch("http://localhost:8080/offer/create", { // Ensure the correct endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${messageDto.token}`, // Include the authentication token
          },
          body: JSON.stringify(messageDto),
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            resolve();
          })
          .catch(reject);
      });
      const conversationId = [messageDto.senderId, messageDto.receiverId]
        .sort()
        .join("-");
      set((state) => {
        const conversation = state.conversations[conversationId] || {
          messages: [],
        };
        const updatedConversations = {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            messages: [...conversation.messages, messageDto],
          },
        };
        return { conversations: updatedConversations };
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
}));

export default useChatStore;
