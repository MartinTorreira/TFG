package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.Product;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class NotificationConversor {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");

    public static NotificationDto toDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getUser().getId(),
                notification.getProduct().getId(),
                notification.getMessage(),
                dateFormat.format(notification.getCreatedAt()),
                notification.isRead()
        );
    }

    public static Notification toEntity(NotificationDto notificationDto, User user, Product product) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setProduct(product);
        notification.setMessage(notificationDto.getMessage());
        try {
            notification.setCreatedAt(dateFormat.parse(notificationDto.getCreatedAt()));
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format", e);
        }
        notification.setRead(notificationDto.isRead());
        return notification;
    }
}