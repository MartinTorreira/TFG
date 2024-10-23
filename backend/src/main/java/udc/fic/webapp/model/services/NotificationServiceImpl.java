package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.entities.NotificationDao;
import udc.fic.webapp.model.entities.ProductDao;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.Date;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationDao notificationDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Override
    public Notification createNotification(Long userId, Long productId, String message) throws InstanceNotFoundException {
        Notification notification = new Notification();
        notification.setUser(userDao.findById(userId).orElseThrow(() -> new InstanceNotFoundException("User not found", userId)));
        notification.setProduct(productDao.findById(productId).orElseThrow(() -> new InstanceNotFoundException("Product not found", productId)));
        notification.setMessage(message);
        notification.setCreatedAt(new Date());
        notification.setRead(false);
        return notificationDao.save(notification);
    }

    @Override
    public Page<Notification> getNotificationsByUserId(Long userId, Pageable pageable) {
        return notificationDao.findByUserId(userId, pageable);
    }

    @Override
    public void markAsRead(Long notificationId) throws InstanceNotFoundException {
        Notification notification = notificationDao.findById(notificationId)
                .orElseThrow(() -> new InstanceNotFoundException("Notification not found", notificationId));
        notification.setRead(true);
        notificationDao.save(notification);
    }
}