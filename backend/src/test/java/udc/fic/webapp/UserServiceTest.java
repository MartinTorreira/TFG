package udc.fic.webapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.Rating;
import udc.fic.webapp.model.entities.RatingDao;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.*;
import udc.fic.webapp.model.services.PermissionCheckerImpl;
import udc.fic.webapp.model.services.UserService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RatingDao ratingDao;


    private final Long NON_EXISTENT_ID = Long.valueOf(-1);
    @Autowired
    private PermissionCheckerImpl permissionCheckerImpl;


    private User createUser(String userName) {
        return new User(userName, "password", "firstName", "lastName", userName + "@" + userName + ".com", 0,  "avatar",null);
    }

    @Test
    public void testSignUpAndLoginFromId() throws DuplicateInstanceException, InstanceNotFoundException, DuplicateEmailException {

        User user = createUser("user");


        userService.signUp(user);

        User loggedInUser = userService.loginFromId(user.getId());

        assertEquals(User.RoleType.USER, user.getRole());
    }

    @Test
    public void testSignUpDuplicatedUserName() throws DuplicateInstanceException, DuplicateEmailException {

        User user = createUser("user");

        userService.signUp(user);
        assertThrows(DuplicateInstanceException.class, () -> userService.signUp(user));

    }

    @Test
    public void testSignUpDuplicatedEmailThrowsException() throws DuplicateInstanceException, DuplicateEmailException {

        User user1 = createUser("user1");
        User user2 = createUser("user2");

        userService.signUp(user1);
        user2.setEmail(user1.getEmail());

        assertThrows(DuplicateEmailException.class, () -> userService.signUp(user2));
    }

    @Test
    public void testLoginFromNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () -> userService.loginFromId(NON_EXISTENT_ID));
    }

    @Test
    public void testLoginInexistentUser() throws DuplicateInstanceException, DuplicateEmailException {
        User user = createUser("user");

        userService.signUp(user);

        assertThrows(IncorrectLoginException.class, () -> userService.login("X" + user.getUserName(), user.getPassword()));
    }

    @Test
    public void testLoginIncorrectPassword() throws DuplicateInstanceException, DuplicateEmailException {
        User user = createUser("user");

        userService.signUp(user);

        assertThrows(IncorrectLoginException.class, () -> userService.login(user.getUserName(), "X" + user.getPassword()));
    }

    @Test
    public void testLoginFromId() throws DuplicateInstanceException, InstanceNotFoundException, DuplicateEmailException {
        User user = createUser("user");

        userService.signUp(user);

        User loggedInUser = userService.loginFromId(user.getId());

        assertEquals(user, loggedInUser);
    }

    @Test
    public void testUpdateProfile() throws InstanceNotFoundException, DuplicateInstanceException, DuplicateEmailException {

        User user = createUser("user");

        userService.signUp(user);

        user.setFirstName('X' + user.getFirstName());
        user.setLastName('X' + user.getLastName());
        user.setEmail('X' + user.getEmail());

        userService.updateProfile(user.getId(), 'X' + user.getUserName(), 'X' + user.getFirstName(), 'X' + user.getLastName(),
                'X' + user.getEmail(), 'X' + user.getAvatar());

        User updatedUser = userService.loginFromId(user.getId());

        assertEquals(user, updatedUser);
    }

    @Test
    public void testUpdateProfileWithNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () ->
                userService.updateProfile(NON_EXISTENT_ID, "X", "X", "X", "X", "X"));
    }


    @Test
    public void testUpdateProfileWithDuplicateUserName() throws DuplicateInstanceException, DuplicateEmailException {
        User user1 = createUser("user1");
        User user2 = createUser("user2");

        userService.signUp(user1);
        userService.signUp(user2);

        assertThrows(DuplicateInstanceException.class, () ->
                userService.updateProfile(user2.getId(), user1.getUserName(), user2.getFirstName(), user2.getLastName(), user2.getEmail(), user2.getAvatar())
        );
    }

    @Test
    public void testUpdateProfileWithDuplicateEmail() throws DuplicateInstanceException, DuplicateEmailException {
        User user1 = createUser("user1");
        User user2 = createUser("user2");

        userService.signUp(user1);
        userService.signUp(user2);

        assertThrows(DuplicateEmailException.class, () ->
                userService.updateProfile(user2.getId(), user2.getUserName(), user2.getFirstName(), user2.getLastName(), user1.getEmail(), user2.getAvatar())
        );
    }


    @Test
    public void testChangePassword() throws DuplicateInstanceException, InstanceNotFoundException,
            IncorrectPasswordException, IncorrectLoginException, DuplicateEmailException {

        User user = createUser("user");
        user.setRole(User.RoleType.USER);
        String oldPassword = user.getPassword();
        String newPassword = 'X' + oldPassword;

        userService.signUp(user);
        userService.changePassword(user.getId(), oldPassword, newPassword);
        userService.login(user.getUserName(), newPassword);

    }

    @Test
    public void testChangePasswordWithNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () ->
                userService.changePassword(NON_EXISTENT_ID, "X", "Y"));
    }

    @Test
    public void testChangePasswordWithIncorrectPassword() throws DuplicateInstanceException, DuplicateEmailException {

        User user = createUser("user");
        String oldPassword = user.getPassword();
        String newPassword = 'X' + oldPassword;

        userService.signUp(user);
        assertThrows(IncorrectPasswordException.class, () ->
                userService.changePassword(user.getId(), 'Y' + oldPassword, newPassword));

    }


    @Test
    public void testFindAll() throws DuplicateEmailException, DuplicateInstanceException {
        User user1 = createUser("user1");
        User user2 = createUser("user2");

        userService.signUp(user1);
        userService.signUp(user2);

        assertEquals(2, userService.findAll().size());
    }

    // change avatar
    @Test
    public void testChangeAvatar() throws DuplicateInstanceException, InstanceNotFoundException, DuplicateEmailException {
        User user = createUser("user");
        userService.signUp(user);
        String newAvatar = "newAvatar";

        userService.changeAvatar(user.getId(), newAvatar);
        User updatedUser = userService.loginFromId(user.getId());

        assertEquals(newAvatar, updatedUser.getAvatar());
    }

    @Test
    public void testGetUserById() throws DuplicateInstanceException, InstanceNotFoundException, DuplicateEmailException {
        User user = createUser("user");
        userService.signUp(user);

        User userById = userService.getUserById(user.getId());

        assertEquals(user, userById);
    }


    @Test
    public void testRateUser() throws InstanceNotFoundException, DuplicateEmailException, DuplicateInstanceException {
        User user = createUser("user");
        userService.signUp(user);

        int rate = 5;
        userService.rateUser(user.getId(), rate);

        List<Rating> rating = ratingDao.findByUserId(user.getId());
        assertEquals(rate, rating.get(0).getRate());
    }


    @Test
    public void testCheckUserExists() throws InstanceNotFoundException {
        User user = createUser("user");
        userDao.save(user);

        permissionCheckerImpl.checkUserExists(user.getId());
    }


    @Test
    public void testCheckUserExistsWithNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () -> permissionCheckerImpl.checkUserExists(NON_EXISTENT_ID));
    }

    @Test
    public void testCheckUser() throws InstanceNotFoundException {
        User user = createUser("user");
        userDao.save(user);

        User checkedUser = permissionCheckerImpl.checkUser(user.getId());
        assertEquals(user, checkedUser);
    }

    @Test
    public void testCheckUserWithNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () -> permissionCheckerImpl.checkUser(NON_EXISTENT_ID));
    }


    @Test
    public void testIncorrectLoginException() {
        String userName = "testUser";
        String password = "testPassword";

        IncorrectLoginException exception = new IncorrectLoginException(userName, password);

        assertEquals(userName, exception.getUserName());
        assertEquals(password, exception.getPassword());
    }


    private class TestInstanceException extends InstanceException {
        public TestInstanceException(String name, Object key) {
            super(name, key);
        }
    }

    @Test
    public void testInstanceException() {
        String name = "testName";
        Object key = "testKey";

        InstanceException exception = new TestInstanceException(name, key);

        assertEquals(name, exception.getName());
        assertEquals(key, exception.getKey());
    }


    @Test
    public void testIncorrectOldPasswordException() {
        String name = "testName";
        Object key = "testKey";

        IncorrectOldPasswordException exception = new IncorrectOldPasswordException(name, key);

        assertEquals(name, exception.getName());
        assertEquals(key, exception.getKey());
    }

    @Test
    public void testNonExistentSessionException() {
        String message = "Session does not exist";

        NonExistentSessionException exception = new NonExistentSessionException(message);

        assertEquals(message, exception.getMessage());
    }


    @Test
    public void testPermissionException() {
        String message = "Permission denied";

        PermissionException exception = new PermissionException(message);

        assertEquals(message, exception.getMessage());
    }

    @Test
    public void testPermissionExceptionMessage() {
        String errorMessage = "Permission denied";
        PermissionException exception = assertThrows(PermissionException.class, () -> {
            throw new PermissionException(errorMessage);
        });

        assertEquals(errorMessage, exception.getMessage());
    }

    @Test
    public void testSessionAlreadyStartedException() {
        String message = "Session already started";

        SessionAlreadyStartedException exception = new SessionAlreadyStartedException(message);

        assertEquals(message, exception.getMessage());
    }

}