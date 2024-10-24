package udc.fic.webapp.rest.dto;

import java.util.Date;

public class NotificationDto {

        private Long id;
        private Long userId;
        private Long productId;
        private String message;
        private String createdAt;
        private boolean isRead;

        public NotificationDto() {
        }

        public NotificationDto(Long id, Long userId, Long productId, String message, String createdAt, boolean isRead) {
            this.id = id;
            this.userId = userId;
            this.productId = productId;
            this.message = message;
            this.createdAt = createdAt;
            this.isRead = isRead;
        }


        public Long getId() {
            return id;
        }

        public Long getUserId() {
            return userId;
        }

        public Long getProductId() {
            return productId;
        }

        public String getMessage() {
            return message;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public boolean isRead() {
            return isRead;
        }
}
