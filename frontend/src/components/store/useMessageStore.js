import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Persist => guarda en localstorage

const useMessageStore = create(
  persist(
    (set) => ({
      messages: [],
      conversations: {}, // Almacena conversaciones por usuario
      addMessage: (message) => set((state) => {
        const { receiverId } = message;
        const newMessages = [...state.messages, message];

        // Agregar el mensaje a la conversación correspondiente
        const updatedConversations = {
          ...state.conversations,
          [receiverId]: [...(state.conversations[receiverId] || []), message]
        };

        return { messages: newMessages, conversations: updatedConversations };
      }),
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: "message-storage", 
    }
  )
);


export default useMessageStore;