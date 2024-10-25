package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Notification;
import udc.fic.webapp.model.entities.Purchase;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class NotificationConversor {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");

    public static NotificationDto toDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getPurchase().getId(),
                notification.getMessage(),
                dateFormat.format(notification.getCreatedAt()),
                notification.isRead()
        );
    }

    public static Notification toEntity(NotificationDto notificationDto, Purchase purchase) {
        Notification notification = new Notification();
        notification.setPurchase(purchase);
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