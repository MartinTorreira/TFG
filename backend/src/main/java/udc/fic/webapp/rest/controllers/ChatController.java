package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.entities.ChatMessageDao;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.ChatService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.ChatMessageConversor;
import udc.fic.webapp.rest.dto.ChatMessageDto;

import java.util.Optional;


@Controller
public class ChatController {

    @Autowired
    public UserDao userDao;

    @Autowired
    private ChatService chatService;


    @MessageMapping("/sendMessage")
   // @SendTo("/topic/messages")
    public void sendMessage(@Payload ChatMessageDto messageDto, SimpMessageHeaderAccessor headerAccessor) throws InstanceNotFoundException {
        chatService.sendMessage(messageDto, headerAccessor);

    }
}