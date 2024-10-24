package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.entities.NotificationDao;
import udc.fic.webapp.model.entities.ProductDao;
import udc.fic.webapp.model.entities.PurchaseDao;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationDao notificationDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private PurchaseDao purchaseDao;

    @Override
    public void createNotification(Long purchaseId, String message) throws InstanceNotFoundException {
        Notification notification = new Notification();
        notification.setPurchase(purchaseDao.findById(purchaseId).orElseThrow(() -> new InstanceNotFoundException("Purchase not found", purchaseId)));
        notification.setMessage(message);
        notification.setCreatedAt(new Date());
        notification.setRead(false);

        notificationDao.save(notification);
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


    @Override
    public List<Notification> getNotificationsByPurchaseId(Long purchaseId) {
        return notificationDao.findByPurchaseId(purchaseId);
    }


    @Override
    public void deleteNotification(Long notificationId) throws InstanceNotFoundException {
        Notification notification = notificationDao.findById(notificationId)
                .orElseThrow(() -> new InstanceNotFoundException("Notification not found", notificationId));
        notificationDao.delete(notification);
    }
}