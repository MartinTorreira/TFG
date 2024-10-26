package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.entities.User;

public class ChatMessageConversor {

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage) {
        return new ChatMessageDto(
                chatMessage.getSender().getId(),
                chatMessage.getReceiver().getId(),
                chatMessage.getContent()
        );
    }

    public static ChatMessage toChatMessage(ChatMessageDto chatMessageDto, User sender, User recipient) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(chatMessageDto.getContent());
        chatMessage.setSender(sender);
        chatMessage.setReceiver(recipient);
        return chatMessage;
    }

}

