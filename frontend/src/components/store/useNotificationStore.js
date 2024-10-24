import { create } from 'zustand';
import { getNotifications } from '../../backend/userService.js';

const useNotificationStore = create((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async (userId) => {
    set({ isLoading: true, error: null });

    await getNotifications(
      userId,
      (data) => {
        set({ notifications: data, isLoading: false });
      },
      (error) => {
        set({ error: error?.globalError || 'Error fetching notifications', isLoading: false });
      }
    );
  },

  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;