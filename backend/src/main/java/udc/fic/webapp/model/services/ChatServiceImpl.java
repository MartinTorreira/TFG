package udc.fic.webapp.model.services;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.entities.ChatMessageDao;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ChatMessageConversor;
import udc.fic.webapp.rest.dto.ChatMessageDto;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    @Autowired
    public ChatMessageDao chatMessageDao;

    @Autowired
    public UserDao userDao;

    @Override
    public ChatMessage sendMessage(ChatMessageDto dto, SimpMessageHeaderAccessor headerAccessor) throws InstanceNotFoundException {
        Long senderId = (Long) headerAccessor.getSessionAttributes().get("userId");

        User sender = userDao.findById(senderId)
                .orElseThrow(() -> new InstanceNotFoundException("User not found", senderId));
        User recipient = userDao.findById(dto.getReceiverId())
                .orElseThrow(() -> new InstanceNotFoundException("User not found", senderId));

        // Convierte el DTO en ChatMessage y guarda en la base de datos
        return chatMessageDao.save(ChatMessageConversor.toChatMessage(dto, sender, recipient));
    }

}
