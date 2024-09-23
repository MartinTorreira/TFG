package udc.fic.webapp.model.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.services.PermissionChecker;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;


@Service
@Transactional(readOnly=true)
public class PermissionCheckerImpl implements PermissionChecker {

    @Autowired
    private UserDao userDao;

    //@Autowired
    //private OrderDao orderDao;

    @Override
    public void checkUserExists(Long userId) throws InstanceNotFoundException {

        if (!userDao.existsById(userId)) {
            throw new InstanceNotFoundException("project.entities.user", userId);
        }

    }

    @Override
    public User checkUser(Long userId) throws InstanceNotFoundException {

        Optional<User> user = userDao.findById(userId);

        if (!user.isPresent()) {
            throw new InstanceNotFoundException("project.entities.user", userId);
        }

        return user.get();

    }



//    @Override
//    public Order checkOrderExistsAndBelongsTo(Long orderId, Long userId)
//            throws InstanceNotFoundException {
//
//        Optional<Order> order = orderDao.findById(orderId);
//
//        if (order.isEmpty()) {
//            throw new InstanceNotFoundException("project.entities.order", orderId);
//        }
//
//        return order.get();
//    }


}