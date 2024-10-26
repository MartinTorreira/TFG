// src/store/useChatStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set) => ({
      chats: {},
      addChat: (chatId, message) => set((state) => {
        const chatMessages = state.chats[chatId]?.messages || [];
        return {
          chats: {
            ...state.chats,
            [chatId]: {
              messages: [...chatMessages, message],
            },
          },
        };
      }),
      setChats: (chats) => set({ chats }),
    }),
    {
      name: "chat-storage",
    }
  )
);

export default useChatStore;
