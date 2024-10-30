package udc.fic.webapp.rest.dto;

public class ChatMessageDto {

    private Long id;
    private String content;
    private Long senderId;
    private Long receiverId;
    private String timestamp;
    private MessageType type;
    private OfferDto offer;

    public enum MessageType {
        TEXT,
        OFFER
    }

    public ChatMessageDto() {
    }

    public ChatMessageDto(Long id, Long senderId, Long receiverId, String content, String timestamp, MessageType type, OfferDto offer) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
        this.offer = offer;
    }

    public ChatMessageDto(Long senderId, Long receiverId, String content, String timestamp, MessageType type, OfferDto offer) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
        this.offer = offer;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public OfferDto getOffer() {
        return offer;
    }

    public void setOffer(OfferDto offer) {
        this.offer = offer;
    }
}