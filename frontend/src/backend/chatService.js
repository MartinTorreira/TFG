import { appFetch, fetchConfig } from "./appFetch";

export const sendMessage = async (messageDto) => {
  return new Promise((resolve, reject) => {
    appFetch(
      "/sendMessage", 
      fetchConfig("MESSAGE", messageDto), 
      resolve,
      reject
    );
  });
};

export const getMessagesBetweenUsers = async (userId1, userId2) => {
  return new Promise((resolve, reject) => {
    appFetch(
      `/chat/messages?userId1=${userId1}&userId2=${userId2}`,
      fetchConfig("GET"), 
      resolve,
      reject
    );
  });
};

export const getChatsForUser = async (userId) => {
  return new Promise((resolve, reject) => {
    appFetch(
      `/chat/user?userId=${userId}`, 
      fetchConfig("GET"),
      resolve,
      reject
    );
  });
};