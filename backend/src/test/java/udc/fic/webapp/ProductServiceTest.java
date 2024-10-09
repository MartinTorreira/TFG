package udc.fic.webapp;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;


import udc.fic.webapp.model.entities.Category;
import udc.fic.webapp.model.entities.CategoryDao;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.exceptions.*;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.UserService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ProductServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryDao categoryDao;


    private static Category parentCategory;
    private static Category category1;
    private static Category category2;

    private List<String> images;


    @BeforeEach
    public void setUp() {
        parentCategory = new Category("parentCategory", null);
        category1 = new Category("category1", parentCategory);
        category2 = new Category("category2", parentCategory);

        categoryDao.save(parentCategory);
        categoryDao.save(category1);
        categoryDao.save(category2);

        images = List.of("image1", "image2", "image3");
    }


    private User createUser(String userName) {
        return new User(userName, "password", "firstName", "lastName", userName + "@" + userName + ".com", 0,  "avatar");
    }


    @Test
    public void testAddProduct() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        assertNotNull(product);

    }


    @Test
    public void testAddProductWithInvalidQuality() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        assertThrows(IllegalArgumentException.class, () -> productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "invalid", 0.0, 0.0, images));

    }

    @Test
    public void testAddProductWithInvalidCategory() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        assertThrows(InstanceNotFoundException.class, () -> productService.addProduct(user.getId(),  Long.valueOf(-1), "product", "description", 10.0, 1, "new", 0.0, 0.0, images));

    }

    @Test
    public void testUpdateProduct() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        productService.updateProduct(user.getId(), product.getId(), category2.getId(), "product", "description", 10.0, 1, 0.0, 0.0, "new", images);

        Product updatedProduct = productService.findProductById(product.getId());

        assertEquals(category2, updatedProduct.getCategory());

    }

    @Test
    public void testUpdateProductWithInvalidQuality() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        assertThrows(IllegalArgumentException.class, () -> productService.updateProduct(user.getId(), product.getId(), category2.getId(), "product", "description", 10.0, 1, 0.0, 0.0, "invalid", images));

    }

    @Test
    public void testUpdateProductWithInvalidCategory() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        assertThrows(InstanceNotFoundException.class, () -> productService.updateProduct(user.getId(), product.getId(), Long.valueOf(-1), "product", "description", 10.0, 1, 0.0, 0.0, "new", images));

    }

    @Test
    public void testDeleteProduct() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        productService.deleteProduct(user.getId(), product.getId());

        assertThrows(InstanceNotFoundException.class, () -> productService.findProductById(product.getId()));

    }

    @Test
    public void testDeleteProductWithInvalidUser() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        assertThrows(IllegalArgumentException.class, () -> productService.deleteProduct(Long.valueOf(-1), product.getId()));

    }

    @Test
    public void testGetLatestProducts() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product1 = productService.addProduct(user.getId(),  category1.getId(), "product1", "description", 10.0, 1, "new", 0.0, 0.0, images);
        Product product2 = productService.addProduct(user.getId(),  category1.getId(), "product2", "description", 10.0, 1, "new", 0.0, 0.0, images);

        List<Product> latestProducts = productService.getLatestProducts(0, 10).getContent();

        assertEquals(2, latestProducts.size());
        assertEquals(product2, latestProducts.get(0));
        assertEquals(product1, latestProducts.get(1));

    }


    @Test
    public void testGetCategories() {
        List<Category> categories = productService.getCategories();

        assertEquals(3, categories.size());
        assertTrue(categories.contains(parentCategory));
        assertTrue(categories.contains(category1));
        assertTrue(categories.contains(category2));

    }

    @Test
    public void testFindProductById() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        Product foundProduct = productService.findProductById(product.getId());

        assertEquals(product, foundProduct);

    }


    @Test
    public void testFindProductByIdWithInvalidId() {
        assertThrows(InstanceNotFoundException.class, () -> productService.findProductById(Long.valueOf(-1)));

    }

    @Test
    public void testGetProductsByUserId() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product1 = productService.addProduct(user.getId(),  category1.getId(), "product1", "description", 10.0, 1, "new", 0.0, 0.0, images);
        Product product2 = productService.addProduct(user.getId(),  category1.getId(), "product2", "description", 10.0, 1, "new", 0.0, 0.0, images);

        List<Product> products = productService.getProductsByUserId(user.getId(), 0, 10).getContent();

        assertEquals(2, products.size());
        assertTrue(products.contains(product1));
        assertTrue(products.contains(product2));

    }


    @Test
    public void testGetProductsByUserIdWithInvalidId() {
        assertThrows(InstanceNotFoundException.class, () -> productService.getProductsByUserId(Long.valueOf(-1), 0, 10));

    }


    @Test
    public void testChangeProductImages() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        List<String> newImages = List.of("newImage1", "newImage2", "newImage3");

        productService.changeProductImages(user.getId(), product.getId(), newImages);

        Product updatedProduct = productService.findProductById(product.getId());

        assertEquals(newImages.size(), updatedProduct.getImage().size());

    }


    @Test
    public void testChangeProductImagesWithInvalidUser() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        List<String> newImages = List.of("newImage1", "newImage2", "newImage3");

        assertThrows(IllegalArgumentException.class, () -> productService.changeProductImages(Long.valueOf(-1), product.getId(), newImages));

    }


    @Test
    public void testChangeProductImagesWithInvalidProduct() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        Product product = productService.addProduct(user.getId(),  category1.getId(), "product", "description", 10.0, 1, "new", 0.0, 0.0, images);

        List<String> newImages = List.of("newImage1", "newImage2", "newImage3");

        assertThrows(InstanceNotFoundException.class, () -> productService.changeProductImages(user.getId(), Long.valueOf(-1), newImages));

    }





}