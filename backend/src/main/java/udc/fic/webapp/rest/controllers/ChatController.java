package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.ChatService;
import udc.fic.webapp.rest.dto.ChatMessageConversor;
import udc.fic.webapp.rest.dto.ChatMessageDto;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void sendMessage(@Payload ChatMessageDto messageDto) throws InstanceNotFoundException {
        ChatMessage chatMessage = chatService.sendMessage(messageDto);
        ChatMessageDto responseDto = ChatMessageConversor.toChatMessageDto(chatMessage);
        messagingTemplate.convertAndSend("/topic/messages", responseDto);
    }

    @GetMapping("/chat/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@RequestParam Long userId1, @RequestParam Long userId2) {
        try {
            List<ChatMessage> messages = chatService.getMessagesBetweenUsers(userId1, userId2);
            List<ChatMessageDto> messageDtos = messages.stream()
                    .map(ChatMessageConversor::toChatMessageDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(messageDtos);
        } catch (InstanceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/chat/user")
    public ResponseEntity<List<ChatMessageDto>> getChatsForUser(@RequestParam Long userId) {
        try {
            List<ChatMessageDto> chatDtos = chatService.getChatsForUser(userId);
            return ResponseEntity.ok(chatDtos);
        } catch (InstanceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



}