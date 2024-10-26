import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Persist => guarda en localstorage

const useMessageStore = create(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: "message-storage", 
    }
  )
);

export default useMessageStore;