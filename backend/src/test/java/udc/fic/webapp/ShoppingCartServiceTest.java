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
import udc.fic.webapp.model.services.PurchaseService;
import udc.fic.webapp.model.services.ShoppingCartService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.ProductDto;
import udc.fic.webapp.rest.dto.PurchaseDto;
import udc.fic.webapp.rest.dto.PurchaseItemConversor;
import udc.fic.webapp.rest.dto.ShoppingCartItemDto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class ShoppingCartServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private ShoppingCartItemDao shoppingCartItemDao;

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private CategoryDao categoryDao;

    private final String ORDER_ID = "38K03169BH194974M";

    private static Category parentCategory;
    private static Category category1;
    private static Category category2;

    private List<Product_Images> images;

    private static Product product;
    private static User buyer;
    private static User seller;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ShoppingCartDao shoppingCartDao;

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
        images = Stream.of("image1", "image2", "image3")
                .map(image -> new Product_Images(product, image))
                .collect(Collectors.toList());
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
    public void createShoppingCart() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        List<ShoppingCartItemDto> shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);
    }

    @Test
    public void addItemToCart() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        List<ShoppingCartItemDto> shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);
    }

    @Test
    public void removeItemFromCart() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        List<ShoppingCartItemDto> shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);

        shoppingCartService.removeItemFromCart(buyer.getId(), shoppingCartItems.get(0).getId());

        shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);
    }

    @Test
    public void updateItemQuantity() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        List<ShoppingCartItemDto> shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);

        shoppingCartItemDto.setId(shoppingCartItems.get(0).getId());
        shoppingCartItemDto.setQuantity(2);

        shoppingCartService.updateItemQuantity(buyer.getId(), shoppingCartItemDto);

        shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);
    }

    @Test
    public void getCartItemIdByProductId() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        Long cartItemId = shoppingCartService.getCartItemIdByProductId(buyer.getId(), product.getId());
        assertNotNull(cartItemId);
    }


    @Test
    public void purchase() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        PurchaseDto purchaseDto = createPurchaseDto();
        purchaseService.createPurchase(purchaseDto);

        List<Purchase> purchases = purchaseDao.findAll();
        assertNotNull(purchases);
    }

    @Test
    public void purchaseWithInvalidProduct() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        PurchaseDto purchaseDto = createPurchaseDto();
        purchaseDto.getPurchaseItems().get(0).setProductId(0L);

        try {
            purchaseService.createPurchase(purchaseDto);
        } catch (InstanceNotFoundException e) {
            assertNotNull(e);
        }
    }

    @Test
    public void purchaseWithInvalidBuyer() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        PurchaseDto purchaseDto = createPurchaseDto();
        purchaseDto.setBuyerId(0L);

        try {
            purchaseService.createPurchase(purchaseDto);
        } catch (InstanceNotFoundException e) {
            assertNotNull(e);
        }
    }

    @Test
    public void purchaseWithInvalidSeller() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        PurchaseDto purchaseDto = createPurchaseDto();
        purchaseDto.setSellerId(0L);

        try {
            purchaseService.createPurchase(purchaseDto);
        } catch (InstanceNotFoundException e) {
            assertNotNull(e);
        }
    }


    @Test
    public void purchaseWithInvalidAmount() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        PurchaseDto purchaseDto = createPurchaseDto();
        purchaseDto.setAmount(0.0);

        try {
            purchaseService.createPurchase(purchaseDto);
        } catch (IllegalArgumentException e) {
            assertNotNull(e);
        }
    }

   @Test
   public void testGetProductByCartItemId() throws InstanceNotFoundException {
       shoppingCartService.createShoppingCart(buyer.getId());
       product.setImage(Stream.of("image1", "image2", "image3").map(image -> new Product_Images(product, image)).toList());

       ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
       shoppingCartItemDto.setProductId(product.getId());
       shoppingCartItemDto.setQuantity(1);

       shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

       List<ShoppingCartItemDto> shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
       Assertions.assertNotNull(shoppingCartItems);

       Long cartItemId = shoppingCartItems.get(0).getId();
       ProductDto productDto = shoppingCartService.getProductByCartItemId(buyer.getId(), cartItemId);
       Assertions.assertNotNull(productDto);
       assertEquals(product.getId(), productDto.getId());
   }


    @Test
    public void testAddItemToCartProductAlreadyInCartThrowsException() throws InstanceNotFoundException {

        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        List<ShoppingCartItemDto> shoppingCartItems = shoppingCartService.getShoppingCartItemsByUser(buyer.getId());
        assertNotNull(shoppingCartItems);

        ShoppingCartItemDto shoppingCartItemDto2 = new ShoppingCartItemDto();
        shoppingCartItemDto2.setProductId(product.getId());
        shoppingCartItemDto2.setQuantity(1);

        assertThrows(IllegalArgumentException.class, () -> shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto2));
    }

    @Test
    public void testAddItemToCartUserOwnerOfProductCantAddItToHisCartThrowsException()  {
        shoppingCartService.createShoppingCart(seller.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        assertThrows(IllegalArgumentException.class, () -> shoppingCartService.addItemToCart(seller.getId(), shoppingCartItemDto));
    }

    @Test
    public void testRemoveItemFromCartItemNotFound() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        assertThrows(InstanceNotFoundException.class, () -> {
            shoppingCartService.removeItemFromCart(buyer.getId(), 1L);
        });
    }



    @Test
    public void testUpdateItemQuantityItemNotFound() throws InstanceNotFoundException {
        shoppingCartService.createShoppingCart(buyer.getId());

        ShoppingCartItemDto shoppingCartItemDto = new ShoppingCartItemDto();
        shoppingCartItemDto.setProductId(product.getId());
        shoppingCartItemDto.setQuantity(1);

        shoppingCartService.addItemToCart(buyer.getId(), shoppingCartItemDto);

        shoppingCartItemDto.setId(1L);
        shoppingCartItemDto.setQuantity(2);

        assertThrows(InstanceNotFoundException.class, () -> {
            shoppingCartService.updateItemQuantity(buyer.getId(), shoppingCartItemDto);
        });
    }




}
