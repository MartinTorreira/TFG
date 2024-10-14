package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.PurchaseItem;

public class PurchaseItemConversor {

    private PurchaseItemConversor() {}

    public final static PurchaseItemDto toDto(PurchaseItem purchaseItem) {
        PurchaseItemDto dto = new PurchaseItemDto();
        dto.setId(purchaseItem.getId());
        dto.setProductId(purchaseItem.getProduct().getId());
        dto.setQuantity(purchaseItem.getQuantity());
        return dto;
    }

    public final static PurchaseItem toEntity(PurchaseItemDto dto) {
        PurchaseItem purchaseItem = new PurchaseItem();
        purchaseItem.setQuantity(dto.getQuantity());
        return purchaseItem;
    }
}
