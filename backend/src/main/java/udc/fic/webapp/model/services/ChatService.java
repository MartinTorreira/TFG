package udc.fic.webapp.model.services;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ChatMessageDto;

@Service
public interface ChatService {

    ChatMessage sendMessage(ChatMessageDto dto, SimpMessageHeaderAccessor headerAccessor) throws InstanceNotFoundException;

}