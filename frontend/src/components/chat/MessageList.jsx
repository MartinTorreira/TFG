import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.senderId === message.receiverId ? 'You' : `User ${message.senderId}`}</strong>
          : {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
