package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.entities.PurchaseItem;

import java.util.stream.Collectors;

public class PurchaseConversor {

    private PurchaseConversor() {}

    public final static PurchaseDto toDto(Purchase purchase) {
        PurchaseDto dto = new PurchaseDto();
        dto.setId(purchase.getId());
        dto.setBuyerId(purchase.getBuyer().getId());
        dto.setSellerId(purchase.getSeller().getId());
        dto.setAmount(purchase.getAmount());
        dto.setPurchaseDate(purchase.getPurchaseDate());
        dto.setPaymentMethod(String.valueOf(purchase.getPaymentMethod()));
        dto.setOrderId(purchase.getOrderId());
        dto.setPurchaseItems(purchase.getItems().stream().map(PurchaseConversor::toDto).collect(Collectors.toList()));
        return dto;
    }

    public final static PurchaseItemDto toDto(PurchaseItem purchaseItem) {
        PurchaseItemDto dto = new PurchaseItemDto();
        dto.setId(purchaseItem.getId());
        dto.setProductId(purchaseItem.getProduct().getId());
        dto.setQuantity(purchaseItem.getQuantity());
        return dto;
    }

    public final static Purchase toEntity(PurchaseDto dto) {
        Purchase purchase = new Purchase();
        purchase.setAmount(dto.getAmount());
        purchase.setPaymentMethod(Purchase.PaymentMethod.valueOf(dto.getPaymentMethod()));
        purchase.setOrderId(dto.getOrderId());
        return purchase;
    }

    public final static PurchaseItem toEntity(PurchaseItemDto dto) {
        PurchaseItem purchaseItem = new PurchaseItem();
        purchaseItem.setQuantity(dto.getQuantity());
        return purchaseItem;
    }

}
