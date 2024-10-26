import React from 'react';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div>
      {chats.map(chat => (
        <div 
          key={chat.id} 
          onClick={() => onSelectChat(chat.id)} 
          className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
        >
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          <div className="ml-3">
            <p className="font-medium">{chat.title}</p>
            <p className="text-sm text-gray-500">{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
