package udc.fic.webapp.model.services;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.ChatMessage;
import udc.fic.webapp.model.entities.ChatMessageDao;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ChatMessageDto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    @Autowired
    public ChatMessageDao chatMessageDao;

    @Autowired
    public UserDao userDao;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    @Override
    public ChatMessage sendMessage(ChatMessageDto chatMessageDto) throws InstanceNotFoundException {
        Long senderId = chatMessageDto.getSenderId();
        Long receiverId = chatMessageDto.getReceiverId();

        if (senderId == null || receiverId == null) {
            throw new IllegalArgumentException("The given id must not be null!");
        }

        User sender = userDao.findById(senderId)
                .orElseThrow(() -> new InstanceNotFoundException("User not found with id: ", senderId));
        User receiver = userDao.findById(receiverId)
                .orElseThrow(() -> new InstanceNotFoundException("User not found with id: ", receiverId));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setReceiver(receiver);
        chatMessage.setContent(chatMessageDto.getContent());

        if (chatMessageDto.getTimestamp() != null) {
            chatMessage.setTimestamp(LocalDateTime.parse(chatMessageDto.getTimestamp(), formatter));
        } else {
            chatMessage.setTimestamp(LocalDateTime.now());
        }

        return chatMessageDao.save(chatMessage);
    }

    @Override
    public List<ChatMessage> getMessagesBetweenUsers(Long userId1, Long userId2) throws InstanceNotFoundException {
        return chatMessageDao.findMessagesBetweenUsers(userId1, userId2);
    }

    @Override
    public List<ChatMessageDto> getChatsForUser(Long userId) throws InstanceNotFoundException {
        List<ChatMessage> messages = chatMessageDao.findMessagesByUserId(userId);
        if (messages.isEmpty()) {
            throw new InstanceNotFoundException("No chats found for user with id: ", userId);
        }

        List<ChatMessageDto> chatDtos = new ArrayList<>();

        for (ChatMessage message : messages) {
            ChatMessageDto chatDto = new ChatMessageDto(
                    message.getSender().getId(),
                    message.getReceiver().getId(),
                    message.getContent(),
                    message.getTimestamp().toString()
            );

            chatDtos.add(chatDto);
        }
        return chatDtos;
    }

    @Override
    public List<ChatMessage> getMessagesByUser(Long userId) throws InstanceNotFoundException {
        return chatMessageDao.findMessagesByUserId(userId);
    }
}