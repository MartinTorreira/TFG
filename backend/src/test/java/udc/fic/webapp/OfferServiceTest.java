package udc.fic.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.ChatService;
import udc.fic.webapp.model.services.OfferService;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.OfferConversor;
import udc.fic.webapp.rest.dto.OfferDto;
import udc.fic.webapp.rest.dto.OfferItemDto;

import java.util.List;
import java.util.stream.Stream;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class OfferServiceTest {

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
    public void testCreateOffer()  {

        OfferDto offerDto = new OfferDto();
        offerDto.setAmount(10.0);
        offerDto.setBuyerId(user2.getId());
        OfferItemDto itemDto = new OfferItemDto();
        itemDto.setQuantity(1);
        itemDto.setProductId(product1.getId());
        offerDto.setItems(List.of(itemDto));

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, user2, user1, List.of(product1)));
        assertNotNull(offer);
        assertEquals(offer.getAmount(), offerDto.getAmount());
        assertEquals(offer.getBuyer(), user2);
        assertEquals(offer.getSeller(), user1);
        assertEquals(offer.getItems().size(), 1);
        assertEquals(offer.getItems().get(0).getProduct(), product1);
    }


    @Test
    public void testGetOffer() throws InstanceNotFoundException {
        OfferDto offerDto = new OfferDto();
        offerDto.setAmount(10.0);
        offerDto.setBuyerId(user2.getId());
        OfferItemDto itemDto = new OfferItemDto();
        itemDto.setQuantity(1);
        itemDto.setProductId(product1.getId());
        offerDto.setItems(List.of(itemDto));

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, user2, user1, List.of(product1)));

        Offer foundOffer = offerService.getOffer(offer.getId());
        assertNotNull(foundOffer);
        assertEquals(foundOffer.getAmount(), offerDto.getAmount());
        assertEquals(foundOffer.getBuyer(), user2);
        assertEquals(foundOffer.getSeller(), user1);
        assertEquals(foundOffer.getItems().size(), 1);
        assertEquals(foundOffer.getItems().get(0).getProduct(), product1);
    }

    @Test
    public void testGetOfferWithInvalidId() {
        assertThrows(InstanceNotFoundException.class, () -> offerService.getOffer(1L));
    }

    @Test
    public void testDeleteOffer() throws InstanceNotFoundException {
        OfferDto offerDto = new OfferDto();
        offerDto.setAmount(10.0);
        offerDto.setBuyerId(user2.getId());
        OfferItemDto itemDto = new OfferItemDto();
        itemDto.setQuantity(1);
        itemDto.setProductId(product1.getId());
        offerDto.setItems(List.of(itemDto));

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, user2, user1, List.of(product1)));

        offerService.deleteOffer(offer.getId());
        assertThrows(InstanceNotFoundException.class, () -> offerService.getOffer(offer.getId()));
    }


    @Test
    public void testGetAllOffers() {
        OfferDto offerDto = new OfferDto();
        offerDto.setAmount(10.0);
        offerDto.setBuyerId(user2.getId());
        OfferItemDto itemDto = new OfferItemDto();
        itemDto.setQuantity(1);
        itemDto.setProductId(product1.getId());
        offerDto.setItems(List.of(itemDto));

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, user2, user1, List.of(product1)));

        List<Offer> offers = offerService.getAllOffers();
        assertEquals(offers.size(), 1);
        assertEquals(offers.get(0).getAmount(), offerDto.getAmount());
        assertEquals(offers.get(0).getBuyer(), user2);
        assertEquals(offers.get(0).getSeller(), user1);
        assertEquals(offers.get(0).getItems().size(), 1);
        assertEquals(offers.get(0).getItems().get(0).getProduct(), product1);
    }

    @Test
    public void testGetOffersByBuyerId() {
        OfferDto offerDto = new OfferDto();
        offerDto.setAmount(10.0);
        offerDto.setBuyerId(user2.getId());
        OfferItemDto itemDto = new OfferItemDto();
        itemDto.setQuantity(1);
        itemDto.setProductId(product1.getId());
        offerDto.setItems(List.of(itemDto));

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, user2, user1, List.of(product1)));

        List<Offer> offers = offerService.getOffersByBuyerId(user2.getId());
        assertEquals(offers.size(), 1);
        assertEquals(offers.get(0).getAmount(), offerDto.getAmount());
        assertEquals(offers.get(0).getBuyer(), user2);
        assertEquals(offers.get(0).getSeller(), user1);
        assertEquals(offers.get(0).getItems().size(), 1);
        assertEquals(offers.get(0).getItems().get(0).getProduct(), product1);
    }

    @Test
    public void testGetOffersBySellerId() {
        OfferDto offerDto = new OfferDto();
        offerDto.setAmount(10.0);
        offerDto.setBuyerId(user2.getId());
        OfferItemDto itemDto = new OfferItemDto();
        itemDto.setQuantity(1);
        itemDto.setProductId(product1.getId());
        offerDto.setItems(List.of(itemDto));

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, user2, user1, List.of(product1)));

        List<Offer> offers = offerService.getOffersBySellerId(user1.getId());
        assertEquals(offers.size(), 1);
        assertEquals(offers.get(0).getAmount(), offerDto.getAmount());
        assertEquals(offers.get(0).getBuyer(), user2);
        assertEquals(offers.get(0).getSeller(), user1);
        assertEquals(offers.get(0).getItems().size(), 1);
        assertEquals(offers.get(0).getItems().get(0).getProduct(), product1);
    }





}
