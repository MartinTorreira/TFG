// src/components/ChatList.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/useChatStore';
import { getChatsForUser } from '../../backend/chatService';
import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';

const ChatList = () => {
    const { user } = useContext(LoginContext);
    const { conversations, setConversations } = useChatStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      getChatsForUser(user.id, setConversations, (error) => console.error('Error fetching chats:', error));
    }, [user.id, setConversations]);
  
    const handleConversationClick = (conversationId) => {
      navigate(`/chat/${conversationId}`);
    };
  
    return (
      <div className="conversation-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="conversation-item"
            onClick={() => handleConversationClick(conversation.id)}
          >
            <p>{conversation.content}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default ChatList;