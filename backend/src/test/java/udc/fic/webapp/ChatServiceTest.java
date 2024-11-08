package udc.fic.webapp;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.DuplicateEmailException;
import udc.fic.webapp.model.exceptions.DuplicateInstanceException;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.ChatService;
import udc.fic.webapp.model.services.OfferService;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.ChatMessageDto;
import udc.fic.webapp.rest.dto.OfferConversor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ChatServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private ChatService chatService;

    @Autowired
    private OfferService offerService;

    @Autowired
    private OfferDao offerDao;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private UserDao userDao;

    private static Category parentCategory;
    private static Category category1;
    private static Category category2;

    private List<Product_Images> images;

    private User user1;
    private User user2;

    private Offer offer1;

    private Product product1;


    @BeforeEach
    public void setUp() {
        user1 = new User("user1", "password", "firstName", "lastName", "user1" + "@" + "user1" + ".com", 0,  "avatar",null);
        user2 = new User("user2", "password", "firstName", "lastName", "user2" + "@" + "user2" + ".com", 0,  "avatar",null);
        userDao.save(user1);
        userDao.save(user2);

        parentCategory = new Category("parentCategory", null);
        category1 = new Category("category1", parentCategory);
        category2 = new Category("category2", parentCategory);

        categoryDao.save(parentCategory);
        categoryDao.save(category1);
        categoryDao.save(category2);

        product1  = new Product("product", "description", 10.0, 10, Product.Quality.NEW, 0.0, 0.0, null, user1, category1);
        images = Stream.of("image1", "image2", "image3").map(image -> new Product_Images(product1, image)).toList();

        productDao.save(product1);
    }

    @Test
    public void testSendMessage() throws DuplicateEmailException, DuplicateInstanceException, InstanceNotFoundException {
        chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", "2021-06-01T12:00:00", "TEXT",null));
        assertNotNull(chatService.getMessagesBetweenUsers(user1.getId(), user2.getId()));
    }

    @Test
    public void testSendMessageWithNullTimestamp() throws DuplicateEmailException, DuplicateInstanceException, InstanceNotFoundException {
        chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", null, "TEXT",null));
        assertNotNull(chatService.getMessagesBetweenUsers(user1.getId(), user2.getId()));
    }

    @Test
    public void testGetMessagesBetweenUsers() throws DuplicateEmailException, DuplicateInstanceException, InstanceNotFoundException {
        chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", "2021-06-01T12:00:00", "TEXT",null));
        assertNotNull(chatService.getMessagesBetweenUsers(user1.getId(), user2.getId()));
    }

    @Test
    public void testGetChatsForUser() throws DuplicateEmailException, DuplicateInstanceException, InstanceNotFoundException {
        chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", "2021-06-01T12:00:00", "TEXT",null));
        assertNotNull(chatService.getChatsForUser(user1.getId()));
    }

    @Test
    public void testGetMessagesByUser() throws DuplicateEmailException, DuplicateInstanceException, InstanceNotFoundException {
        chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", "2021-06-01T12:00:00", "TEXT",null));
        assertNotNull(chatService.getMessagesByUser(user1.getId()));
    }


    @Test
    public void testSendMessageWithNullSenderId() {
        assertThrows(IllegalArgumentException.class, () -> chatService.sendMessage(new ChatMessageDto(null, user2.getId(), "Hello", "2021-06-01T12:00:00", "TEXT",null)));
    }


    @Test
    public void testGetChatsForUserWithEmptyMessages() {
        assertThrows(InstanceNotFoundException.class, () -> chatService.getChatsForUser(1L));
    }


    @Test
    public void sendOfferMessageType() throws DuplicateEmailException, DuplicateInstanceException, InstanceNotFoundException {
        Offer offer = new Offer();
        offer.setBuyer(user2);
        offer.setSeller(user1);
        offer.setAmount(10.0);
        offerDao.save(offer);

        offer.setItems(List.of(new OfferItem(offer, product1, 1)));

        chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", "2021-06-01T12:00:00", "OFFER", OfferConversor.toDto(offer)));
        assertNotNull(chatService.getMessagesBetweenUsers(user1.getId(), user2.getId()));
    }


    @Test
    public void sendOfferMessageTypeWithNullOffer() {
        assertThrows(IllegalArgumentException.class, () -> chatService.sendMessage(new ChatMessageDto(user1.getId(), user2.getId(), "Hello", "2021-06-01T12:00:00", "OFFER", null)));
    }



    @Test
    public void testChatMessageConstructorWithoutType() {
        String content = "Hello";
        LocalDateTime timestamp = LocalDateTime.now();
        User sender = new User();
        User receiver = new User();

        ChatMessage chatMessage = new ChatMessage(content, timestamp, sender, receiver);

        Assertions.assertNotNull(chatMessage);
        assertEquals(content, chatMessage.getContent());
        assertEquals(timestamp, chatMessage.getTimestamp());
        assertEquals(sender, chatMessage.getSender());
        assertEquals(receiver, chatMessage.getReceiver());
    }

    @Test
    public void testChatMessageConstructorWithType() {
        String content = "Hello";
        LocalDateTime timestamp = LocalDateTime.now();
        User sender = new User();
        User receiver = new User();
        ChatMessage.MessageType type = ChatMessage.MessageType.TEXT;

        ChatMessage chatMessage = new ChatMessage(content, timestamp, sender, receiver, type);

        Assertions.assertNotNull(chatMessage);
        assertEquals(content, chatMessage.getContent());
        assertEquals(timestamp, chatMessage.getTimestamp());
        assertEquals(sender, chatMessage.getSender());
        assertEquals(receiver, chatMessage.getReceiver());
        assertEquals(type, chatMessage.getType());
    }



}
