package udc.fic.webapp.model.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

@Service
public interface NotificationService {

    Notification createNotification(Long userId, Long productId, String message) throws InstanceNotFoundException;

    Page<Notification> getNotificationsByUserId(Long userId, Pageable pageable);

    void markAsRead(Long notificationId) throws InstanceNotFoundException;
}