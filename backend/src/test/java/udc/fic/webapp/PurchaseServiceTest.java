package udc.fic.webapp;

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
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.PurchaseService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.PurchaseDto;
import udc.fic.webapp.rest.dto.PurchaseItemConversor;

import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class PurchaseServiceTest {

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


}
