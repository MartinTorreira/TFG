package udc.fic.webapp.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ChatMessage {

    public enum MessageType {
        TEXT,
        OFFER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type;

    @ManyToOne
    @JoinColumn(name = "offer_id", nullable = true)
    private Offer offer;


    public ChatMessage() {
    }

    public ChatMessage(String content, LocalDateTime timestamp, User sender, User receiver) {
        this.content = content;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
    }

    public ChatMessage(String content, LocalDateTime timestamp, User sender, User receiver, MessageType type) {
        this.content = content;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
        this.type = type;
    }

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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }
}