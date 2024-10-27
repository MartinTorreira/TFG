import { appFetch, fetchConfig } from "./appFetch";

export const sendMessage = async (messageDto, onSuccess, onError) => {
    appFetch(
        "/sendMessage", 
        fetchConfig("MESSAGE", messageDto), 
        onSuccess,
        onError
    );
};

export const getMessagesBetweenUsers = async (userId1, userId2, onSuccess, onError) => {
    appFetch(
        `/chat/messages?userId1=${userId1}&userId2=${userId2}`,
        fetchConfig("GET"), 
        onSuccess,
        onError
    );
};

// Función para obtener chats para un usuario
export const getChatsForUser = async (userId, onSuccess, onError) => {
    appFetch(
        `/chat/user?userId=${userId}`, 
        fetchConfig("GET"),
        onSuccess,
        onError
    );
};
