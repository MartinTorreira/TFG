package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.OfferItem;

public class OfferItemDto {

    private Long id;
    private Long offerId;
    private Long productId;
    private Integer quantity;

    public OfferItemDto () {}

    public OfferItemDto(Long id, Long offerId, Long productId, Integer quantity) {
        this.id = id;
        this.offerId = offerId;
        this.productId = productId;
        this.quantity = quantity;
    }

    public OfferItemDto(Long offerId, Long productId, Integer quantity) {
        this.offerId = offerId;
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}