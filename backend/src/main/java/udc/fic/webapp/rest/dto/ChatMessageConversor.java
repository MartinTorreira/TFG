package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.User;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ChatMessageConversor {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(chatMessage.getId());
        dto.setContent(chatMessage.getContent());
        dto.setTimestamp(chatMessage.getTimestamp().toString());
        dto.setType(ChatMessageDto.MessageType.valueOf(chatMessage.getType().name()));
        dto.setSenderId(chatMessage.getSender().getId());
        dto.setReceiverId(chatMessage.getReceiver().getId());

        if (chatMessage.getOffer() != null) {
            dto.setOffer(OfferConversor.toDto(chatMessage.getOffer()));
        }

        return dto;
    }

    public static ChatMessage toChatMessage(ChatMessageDto chatMessageDto, User sender, User recipient, User buyer, User seller, List<Product> products) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(chatMessageDto.getContent());
        chatMessage.setSender(sender);
        chatMessage.setReceiver(recipient);
        chatMessage.setTimestamp(LocalDateTime.parse(chatMessageDto.getTimestamp(), formatter));
        chatMessage.setType(ChatMessage.MessageType.valueOf(chatMessageDto.getType().name()));
        chatMessage.setOffer(OfferConversor.toEntity(chatMessageDto.getOffer(), buyer, seller, products));
        return chatMessage;
    }
}