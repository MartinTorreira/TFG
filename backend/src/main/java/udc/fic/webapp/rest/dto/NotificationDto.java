package udc.fic.webapp.rest.dto;

import java.util.Date;

public class NotificationDto {

        private Long id;
        private Long purchaseId;
        private String message;
        private String createdAt;
        private boolean isRead;

        public NotificationDto() {
        }

        public NotificationDto(Long id, Long purchaseId, String message, String createdAt, boolean isRead) {
            this.id = id;
            this.purchaseId = purchaseId;
            this.message = message;
            this.createdAt = createdAt;
            this.isRead = isRead;
        }


        public Long getId() {
            return id;
        }

        public Long getPurchaseId() {
            return purchaseId;
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

        public void setId(Long id) {
            this.id = id;
        }

        public void setPurchaseId(Long purchaseId) {
            this.purchaseId = purchaseId;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public void setRead(boolean read) {
            isRead = read;
        }
}
