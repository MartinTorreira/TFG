import { create } from 'zustand';

const useChatStore = create((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
}));

export default useChatStore;