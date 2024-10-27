import React, { useEffect } from 'react';
import useMessageStore from '../store/useMessageStore.js'
import ChatList from './ChatList.jsx';

const ChatWindow = ({ userId1, userId2 }) => {
  const { messages, sendMessage, getMessagesBetweenUsers } = useMessageStore();

  useEffect(() => {
    // Obtener los mensajes al cargar el componente
    getMessagesBetweenUsers(userId1, userId2);
  }, [userId1, userId2, getMessagesBetweenUsers]);

  const handleSendMessage = (message) => {
    const messageDto = { content: message, senderId: userId1, recipientId: userId2 };
    sendMessage(messageDto);
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow">
      <h2 className="p-4 text-lg font-semibold text-white bg-blue-500 text-center">Conversación</h2>
      <ChatList messages={messages} userId1={userId1} userId2={userId2} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      onSendMessage(message);
      setMessage(''); // Limpiar el input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t border-gray-300">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 p-4 border-none outline-none"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600">Enviar</button>
    </form>
  );
};

export default ChatWindow;