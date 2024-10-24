package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.NotificationService;
import udc.fic.webapp.rest.dto.NotificationDto;
import udc.fic.webapp.rest.dto.NotificationConversor;

@RestController
@RequestMapping("/user")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notifications/create")
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto notificationDto) throws InstanceNotFoundException {
        Notification notification = notificationService.createNotification(
                notificationDto.getUserId(),
                notificationDto.getProductId(),
                notificationDto.getMessage()
        );
        return ResponseEntity.ok(NotificationConversor.toDto(notification));
    }

    @GetMapping("/{userId}/getNotifications")
    public ResponseEntity<Page<NotificationDto>> getNotificationsByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Page<Notification> notifications = notificationService.getNotificationsByUserId(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(notifications.map(NotificationConversor::toDto));
    }

    @PutMapping("/{notificationId}/markAsRead")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        try {
            notificationService.markAsRead(notificationId);
            return ResponseEntity.ok().build();
        } catch (InstanceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}