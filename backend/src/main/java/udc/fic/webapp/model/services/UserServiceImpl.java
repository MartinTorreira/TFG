package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.DuplicateInstanceException;
import udc.fic.webapp.model.exceptions.DuplicateEmailException;
import udc.fic.webapp.model.exceptions.IncorrectLoginException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.exceptions.IncorrectPasswordException;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.Optional;
import java.util.List;


@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private PermissionChecker permissionChecker;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void signUp(User user) throws DuplicateInstanceException, DuplicateEmailException {

        if (userDao.existsByUserName(user.getUserName())) {
            throw new DuplicateInstanceException("Nombre de usuario no disponible", user.getUserName());
        }

        if (userDao.existsByEmail(user.getEmail())) {
            throw new DuplicateEmailException("Email no disponible", user.getEmail());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.RoleType.USER);


        // Create a new shopping cart for the user
       // shoppingCartService.createShoppingCart(user.getId());

        userDao.save(user);

    }   

    @Override
    public User login(String userName, String password) throws IncorrectLoginException{

        Optional<User> user = userDao.findByUserName(userName) ;

        if (!user.isPresent()) {
            throw new IncorrectLoginException(userName, password);
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            System.out.println(user.get().getPassword());
            throw new IncorrectLoginException(userName, password);
        }

        return user.get();
    }

    @Override
    public User loginFromId(Long id) throws InstanceNotFoundException {
        return permissionChecker.checkUser(id);
    }

    @Override
    public User updateProfile(Long id, String userName, String firstName, String lastName, String email, String avatar) throws InstanceNotFoundException, DuplicateInstanceException,DuplicateEmailException {

        User user = permissionChecker.checkUser(id);

        if (!user.getUserName().equals(userName) && userDao.existsByUserName(userName)) {
            throw new DuplicateInstanceException("Nombre de usuario ya registrado", userName);
        }

        if (!user.getEmail().equals(email) && userDao.existsByEmail(email)) {
            throw new DuplicateEmailException("Email ya registrado", email);
        }

        user.setUserName(userName);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setAvatar(avatar);

        return user;
    }



    @Override
    public void changePassword(Long id, String oldPassword, String newPassword)
        throws InstanceNotFoundException, IncorrectPasswordException {

        User user = permissionChecker.checkUser(id);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IncorrectPasswordException("Contraseña incorrecta", oldPassword);
        } else {
            user.setPassword(passwordEncoder.encode(newPassword));
        }
    }


    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }


    @Override
    public void changeAvatar(Long id, String newAvatar)
            throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(id);
        user.setAvatar(newAvatar);
    }


    @Override
    public User getUserById(Long id) throws InstanceNotFoundException {
       return userDao.findById(id).orElseThrow(() -> new InstanceNotFoundException("User", id));
    }

}
