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
import udc.fic.webapp.model.services.FavoriteService;
import udc.fic.webapp.model.services.UserService;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class FavoriteServiceTest {

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserService userService;

    private static Product product1;
    private static User user1;

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
    }


    @Test
    public void testAddFavorite() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        Favorite favorite = favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        assertEquals(user1.getId(), favorite.getUser().getId());
        assertEquals(product.getId(), favorite.getProduct().getId());

    }


    @Test
    public void testAddFavoriteSameUser() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user1, category1);
        productDao.save(product);

        assertThrows(IllegalArgumentException.class, () -> favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now()));

    }

    //User cannot add the same product as favorite twice
    @Test
    public void testAddFavoriteTwice() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        assertThrows(IllegalArgumentException.class, () -> favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now()));

    }

    @Test
    public void testGetLatestFavorites() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product1 = new Product("productName1", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product1);

        Product product2 = new Product("productName2", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product2);

        Product product3 = new Product("productName3", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product3);

        favoriteService.addFavorite(user1.getId(), product1.getId(), LocalDateTime.now());
        favoriteService.addFavorite(user1.getId(), product2.getId(), LocalDateTime.now());
        favoriteService.addFavorite(user1.getId(), product3.getId(), LocalDateTime.now());

        assertEquals(3, favoriteService.getLatestFavorites(0, 10).getTotalElements());

    }


    @Test
    public void testGetFavoritesByUserId() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product1 = new Product("productName1", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product1);

        Product product2 = new Product("productName2", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product2);

        Product product3 = new Product("productName3", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product3);

        favoriteService.addFavorite(user1.getId(), product1.getId(), LocalDateTime.now());
        favoriteService.addFavorite(user1.getId(), product2.getId(), LocalDateTime.now());
        favoriteService.addFavorite(user1.getId(), product3.getId(), LocalDateTime.now());

        assertEquals(3, favoriteService.getFavoritesByUserId(user1.getId(), 0, 10).getTotalElements());

    }


    @Test
    public void testRemoveFavorite() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        Favorite favorite = favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        favoriteService.removeFavorite(user1.getId(), product.getId());

        assertThrows(InstanceNotFoundException.class, () -> favoriteService.findFavoriteById(favorite.getId()));

    }


    @Test
    public void testRemoveFavoriteNonExistent() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        assertThrows(InstanceNotFoundException.class, () -> favoriteService.removeFavorite(user1.getId(), product.getId() + 1));

    }


    @Test
    public void testRemoveFavoriteNonExistentUser() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        assertThrows(InstanceNotFoundException.class, () -> favoriteService.removeFavorite(user1.getId() + 1, product.getId()));

    }


    @Test
    public void testRemoveFavoriteNonExistentFavorite() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        assertThrows(InstanceNotFoundException.class, () -> favoriteService.removeFavorite(user1.getId(), product.getId() + 1));

    }


    @Test
    public void testFindFavoriteById() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {

        User user1 = new User("userName", "password", "firstName", "lastName", "userName@userName" + ".com", 0, "avatar");
        userService.signUp(user1);

        User user2 = new User("userName2", "password", "firstName", "lastName", "userName2@userName2" + ".com", 0, "avatar");
        userService.signUp(user2);

        Product product = new Product("productName", "description", 10.0, 10, 0.0, 0.0, user2, category1);
        productDao.save(product);

        Favorite favorite = favoriteService.addFavorite(user1.getId(), product.getId(), LocalDateTime.now());

        assertEquals(favorite, favoriteService.findFavoriteById(favorite.getId()));

    }


    @Test
    public void testFindFavoriteByIdNonExistent() {

        assertThrows(InstanceNotFoundException.class, () -> favoriteService.findFavoriteById(1L));

    }


}