package udc.fic.webapp.model.services;

import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.exceptions.DuplicateInstanceException;
import udc.fic.webapp.model.exceptions.DuplicateEmailException;
import udc.fic.webapp.model.exceptions.IncorrectLoginException;
import udc.fic.webapp.model.exceptions.IncorrectPasswordException;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.List;

public interface UserService {

    void signUp(User user) throws DuplicateInstanceException, DuplicateEmailException;

    User login(String username, String password) throws IncorrectLoginException;

    User loginFromId(Long id);

    User updateProfile(Long id, String firstName, String lastName, String email, String avatar) throws InstanceNotFoundException;

    void changePassword(Long id, String oldPassword, String newPassword) throws InstanceNotFoundException, IncorrectPasswordException;

    List<User> findAll();

    void changeAvatar(Long id, String url) throws InstanceNotFoundException;
}
