package udc.fic.webapp;

import org.apache.tomcat.jni.Local;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;


import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.exceptions.*;
import udc.fic.webapp.model.services.UserService;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    private final Long NON_EXISTENT_ID = Long.valueOf(-1);


    private User createUser(String userName) {
        return new User(userName, "password", "firstName", "lastName", userName + "@" + userName + ".com", 0,  "avatar");
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
    public void testLoginFromNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () -> userService.loginFromId(NON_EXISTENT_ID));
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
    public void testChangePassword() throws DuplicateInstanceException, InstanceNotFoundException,
            IncorrectPasswordException, IncorrectLoginException, DuplicateEmailException {

        User user = createUser("user");
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




}