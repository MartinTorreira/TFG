package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.entities.User;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ChatMessageConversor {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage) {
        return new ChatMessageDto(
                chatMessage.getSender().getId(),
                chatMessage.getReceiver().getId(),
                chatMessage.getContent(),
                chatMessage.getTimestamp().toString()
        );
    }

    public static ChatMessage toChatMessage(ChatMessageDto chatMessageDto, User sender, User recipient) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(chatMessageDto.getContent());
        chatMessage.setSender(sender);
        chatMessage.setReceiver(recipient);
        chatMessage.setTimestamp(LocalDateTime.parse(chatMessageDto.getTimestamp(), formatter));
        return chatMessage;
    }

}

