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
        if (chatMessage == null) {
            return null;
        }

        OfferDto offerDto = chatMessage.getOffer() != null ? OfferConversor.toDto(chatMessage.getOffer()) : null;

        return new ChatMessageDto(
            chatMessage.getId(),
            chatMessage.getSender().getId(),
            chatMessage.getReceiver().getId(),
            chatMessage.getContent(),
            chatMessage.getTimestamp().format(formatter),
            chatMessage.getType().name(),
            offerDto
        );
    }

    public static ChatMessage toChatMessage(ChatMessageDto chatMessageDto, User sender, User recipient, User buyer, User seller, List<Product> products) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(chatMessageDto.getContent());
        chatMessage.setSender(sender);
        chatMessage.setReceiver(recipient);
        chatMessage.setTimestamp(LocalDateTime.parse(chatMessageDto.getTimestamp(), formatter));
        chatMessage.setType(ChatMessage.MessageType.valueOf(chatMessageDto.getType()));
        chatMessage.setOffer(OfferConversor.toEntity(chatMessageDto.getOffer(), buyer, seller, products));
        return chatMessage;
    }
}