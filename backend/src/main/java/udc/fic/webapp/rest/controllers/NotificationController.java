package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.entities.NotificationDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.NotificationService;
import udc.fic.webapp.rest.dto.NotificationDto;
import udc.fic.webapp.rest.dto.NotificationConversor;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationDao notificationDao;


    @GetMapping("/{userId}/getNotifications")
    public ResponseEntity<Page<NotificationDto>> getNotificationsByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Page<Notification> notifications = notificationService.getNotificationsByUserId(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(notifications.map(NotificationConversor::toDto));
    }

    @PutMapping("/{notificationId}/markAsRead")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long notificationId) throws InstanceNotFoundException {
       Notification notification = notificationDao.findById(notificationId)
               .orElseThrow(() -> new InstanceNotFoundException("Notification not found", notificationId));

       notification.setRead(true);
       notificationDao.save(notification);
       return ResponseEntity.ok(NotificationConversor.toDto(notification));
    }

    @DeleteMapping("/{notificationId}/delete")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) throws InstanceNotFoundException {

        notificationService.deleteNotification(notificationId);

        return ResponseEntity.noContent().build();
    }
}