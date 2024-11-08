package udc.fic.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.DuplicateEmailException;
import udc.fic.webapp.model.exceptions.DuplicateInstanceException;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.PurchaseService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.PurchaseDto;
import udc.fic.webapp.rest.dto.PurchaseItemConversor;

import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class PurchaseServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private PurchaseItemDao purchaseItemDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private final String ORDER_ID = "38K03169BH194974M";
    private final String CAPTURE_ID = "3GD54926EH467243K";


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
    public void testCreateOrder() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        assertEquals(ORDER_ID, purchase.getOrderId());
    }

    @Test
    public void testCompletePurchase() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        purchaseService.completePurchase(purchase.getId());
        assertEquals(Purchase.PurchaseStatus.PENDING, purchase.getPurchaseStatus());
    }

    @Test
    public void testGetPurchaseByProductId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        PurchaseDto purchaseDto1 = purchaseService.getPurchaseByProductId(product.getId());
        assertEquals(purchase.getId(), purchaseDto1.getId());
    }

    @Test
    public void testGetPurchaseByCaptureId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        purchase.setCaptureId(CAPTURE_ID);
        purchaseDao.save(purchase);
        Purchase purchase1 = purchaseService.getPurchaseByCaptureId(CAPTURE_ID);
        assertEquals(purchase.getId(), purchase1.getId());
    }

    @Test
    public void testGetPurchaseById() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        PurchaseDto purchaseDto1 = purchaseService.getPurchaseById(purchase.getId());
        assertEquals(purchase.getId(), purchaseDto1.getId());
    }


    @Test
    public void testGetPurchaseIdFromOrderId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Long purchaseId = purchaseService.getPurchaseIdFromOrderId(ORDER_ID);
        assertEquals(purchase.getId(), purchaseId);
    }

    @Test
    public void testGetProductByOrderId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Product product1 = purchaseService.getProductByOrderId(ORDER_ID);
        assertEquals(product.getId(), product1.getId());
    }


    @Test
    public void testGetPurchasesByUserId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        assertEquals(1, purchaseService.getPurchasesByUserId(buyer.getId(), 0, 10).getTotalElements());
    }


    @Test
    public void testCompletePurchaseWithOrderId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        purchaseService.completePurchase(purchase.getId(), ORDER_ID);
        assertEquals(Purchase.PurchaseStatus.PENDING, purchase.getPurchaseStatus());
    }

    @Test
    public void testChangePurchaseStatus() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        PurchaseDto purchaseDto1 = new PurchaseDto();
        purchaseDto1.setPurchaseStatus(Purchase.PurchaseStatus.COMPLETED.toString());
        PurchaseDto purchaseDto2 = purchaseService.changePurchaseStatus(purchase.getId(), purchaseDto1);
        assertEquals(Purchase.PurchaseStatus.COMPLETED.toString(), purchaseDto2.getPurchaseStatus());
    }


    @Test
    public void testGetPurchaseByCaptureIdThrowsException() throws InstanceNotFoundException {
        assertThrows(InstanceNotFoundException.class, () -> {
            purchaseService.getPurchaseByCaptureId(CAPTURE_ID);
        });
    }

    @Test
    public void testGetPurchaseItems() {
        Product product1 = new Product("product", "description", 10.0, 10, Product.Quality.NEW, 0.0, 0.0, images, seller, category1);
        Product product2 = new Product("product", "description", 10.0, 10, Product.Quality.NEW, 0.0, 0.0, images, seller, category1);
        Product product3 = new Product("product", "description", 10.0, 10, Product.Quality.NEW, 0.0, 0.0, images, seller, category1);

        productDao.saveAll(List.of(product1, product2, product3));
        List<Product> products = List.of(product1, product2, product3);

        List<PurchaseItem> purchaseItems = purchaseService.getPurchaseItems(products);

        assertEquals(3, purchaseItems.size());
        assertEquals(product1, purchaseItems.get(0).getProduct());
        assertEquals(product2, purchaseItems.get(1).getProduct());
        assertEquals(product3, purchaseItems.get(2).getProduct());
        assertEquals(1, purchaseItems.get(0).getQuantity());
        assertEquals(1, purchaseItems.get(1).getQuantity());
        assertEquals(1, purchaseItems.get(2).getQuantity());
    }


    @Test
    public void testGetSalesByUserId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        assertEquals(1, purchaseService.getSalesByUserId(seller.getId(), 0, 10).getTotalElements());
    }

    @Test
    public void testGetSalesByUserIdThrowsExceptionIfUserDoesNotExist() {
        assertThrows(InstanceNotFoundException.class, () -> {
            purchaseService.getSalesByUserId(100L, 0, 10);
        });
    }



    @Test
    public void testDeletePurchase() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        purchaseService.deletePurchase(purchase.getId());
        assertThrows(InstanceNotFoundException.class, () -> {
            purchaseService.getPurchaseById(purchase.getId());
        });
    }

    @Test
    public void testGetSellerIdByPurchaseId() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        Long sellerId = purchaseService.getSellerIdByPurchaseId(purchase.getId());
        assertEquals(seller.getId(), sellerId);
    }

    @Test
    public void testCountPurchases() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        assertEquals(1, purchaseService.countPurchases(seller.getId()));
    }

    @Test
    public void testCountRefundedPurchases() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        assertEquals(0, purchaseService.countRefundedPurchases(seller.getId()));
    }

    @Test
    public void testCountCompletedPurchases() throws InstanceNotFoundException {
        PurchaseDto purchaseDto = createPurchaseDto();
        Purchase purchase = purchaseService.createPurchase(purchaseDto);
        assertEquals(0, purchaseService.countCompletedPurchases(seller.getId()));
    }




}

