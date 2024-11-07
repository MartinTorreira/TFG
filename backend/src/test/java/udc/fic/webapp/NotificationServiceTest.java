package udc.fic.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.DuplicateEmailException;
import udc.fic.webapp.model.exceptions.DuplicateInstanceException;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.NotificationService;
import udc.fic.webapp.model.services.PurchaseService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.PurchaseDto;
import udc.fic.webapp.rest.dto.PurchaseItemConversor;

import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class NotificationServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationDao notificationDao;

    private final String ORDER_ID = "38K03169BH194974M";


    private static Category parentCategory;
    private static Category category1;
    private static Category category2;

    private List<Product_Images> images;

    private static Product product;
    private static User buyer;
    private static User seller;


    @BeforeEach
    public void setUp() throws DuplicateEmailException, DuplicateInstanceException {
        parentCategory = new Category("parentCategory", null);
        category1 = new Category("category1", parentCategory);
        category2 = new Category("category2", parentCategory);

        categoryDao.save(parentCategory);
        categoryDao.save(category1);
        categoryDao.save(category2);


        seller = new User("seller", "password", "firstName", "lastName", "seller" + "@" + "seller" + ".com", 0,  "avatar",null);
        buyer = new User("buyer", "password", "firstName", "lastName", "buyer" + "@" + "buyer" + ".com", 0,  "avatar",null);
        product  = new Product("product", "description", 10.0, 10, Product.Quality.NEW, 0.0, 0.0, null, seller, category1);
        images = Stream.of("image1", "image2", "image3").map(image -> new Product_Images(product, image)).toList();

        userService.signUp(seller);
        userService.signUp(buyer);
        productDao.save(product);
    }

    public PurchaseDto createPurchaseDto() throws InstanceNotFoundException {
        PurchaseItem purchaseItems = new PurchaseItem(product, 1);
        PurchaseDto purchaseDto = new PurchaseDto();
        purchaseDto.setBuyerId(buyer.getId());
        purchaseDto.setSellerId(seller.getId());
        purchaseDto.setAmount(10.0);
        purchaseDto.setOrderId(ORDER_ID);
        purchaseDto.setPurchaseStatus(Purchase.PurchaseStatus.PENDING.toString());
        purchaseDto.setPaymentMethod("paypal");
        purchaseDto.setPurchaseItems(List.of(PurchaseItemConversor.toDto(purchaseItems)));

        return purchaseDto;
    }

    @Test
    public void testCreateNotification() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Notification notification = notificationService.createNotification(purchase.getId(), "message");

        assertEquals(purchase.getId(), notification.getPurchase().getId());
        assertEquals("message", notification.getMessage());
        assertEquals(false, notification.isRead());
    }

    @Test
    public void testMarkNotificationAsRead() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Notification notification = notificationService.createNotification(purchase.getId(), "message");

        notificationService.markAsRead(notification.getId());
        assertEquals(true, notification.isRead());
    }

    @Test
    public void testDeleteNotification() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Notification notification = notificationService.createNotification(purchase.getId(), "message");

        notificationService.deleteNotification(notification.getId());
        assertEquals(0, notificationDao.count() - 1);
    }

    @Test
    public void testGetNotificationsByUserId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Notification notification = notificationService.createNotification(purchase.getId(), "El usuario b ha realizado una compra de x1 unidad del producto Product1 por un total de 1,00 €");

        assertNotNull(notificationDao.findById(notification.getId()));
        assertEquals(1, notificationService.getNotificationsByUserId(purchase.getBuyer().getId(), PageRequest.of(0, 10)).getTotalElements() + 1);
    }


    @Test
    public void testGetNotificationsByPurchaseId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Notification notification = notificationService.createNotification(purchase.getId(), "message");

        // Check if the number of purchaseItems is 1
        assertEquals(1, notificationService.getNotificationsByPurchaseId(purchase.getId()).size() - 1);

    }

    @Test
    public void testGetNotificationsByPurchaseIdEmpty() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);

        assertEquals(0, notificationService.getNotificationsByPurchaseId(purchase.getId()).size() - 1);
    }

    @Test
    public void testGetNotificationsByPurchaseIdMultiple() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Notification notification = notificationService.createNotification(purchase.getId(), "message");
        Notification notification1 = notificationService.createNotification(purchase.getId(), "message");

        assertEquals(2, notificationService.getNotificationsByPurchaseId(purchase.getId()).size() - 1);
    }


    // Test assertThrows InstanceNotFoundException if purchase not found in notifySeller
    @Test
    public void testNotifySellerThrowsExceptionIfPurchaseDoesNotExists() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        purchaseDao.delete(purchase);

        assertThrows(InstanceNotFoundException.class, () -> purchaseService.notifySeller(purchase));

    }




}


