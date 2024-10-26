package udc.fic.webapp.model.services;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ChatMessageDto;

import java.util.List;

@Service
public interface ChatService {

    ChatMessage sendMessage(ChatMessageDto dto) throws InstanceNotFoundException;

    List<ChatMessage> getMessagesBetweenUsers(Long userId1, Long userId2) throws InstanceNotFoundException;

    List<ChatMessageDto> getChatsForUser(Long userId) throws InstanceNotFoundException;

    List<ChatMessage> getMessagesByUser(Long userId) throws InstanceNotFoundException;

    }