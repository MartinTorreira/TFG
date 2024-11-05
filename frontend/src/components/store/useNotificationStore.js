import { create } from 'zustand';
import { getNotifications, markAsRead } from '../../backend/userService.js';

const useNotificationStore = create((set, get) => ({
  notifications: { content: [] }, 
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

  setNotifications: (newNotifications) => set({ notifications: newNotifications }),

  clearNotifications: () => set({ notifications: { content: [] } }), 

  markAllAsRead: async (userId) => {
    const { notifications } = get(); // Obtener el estado actual de las notificaciones
    try {
      await Promise.all(
        notifications.content.map((notification) => markAsRead(notification.id))
      );

      const updatedNotifications = {
        ...notifications,
        content: notifications.content.map((notification) => ({
          ...notification,
          read: true,
        })),
      };

      set({ notifications: updatedNotifications });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  },
}));

export default useNotificationStore;