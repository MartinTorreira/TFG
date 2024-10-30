package udc.fic.webapp.rest.dto;

import java.util.List;

public class OfferDto {

    private Long id;
    private Long buyerId;
    private Long sellerId;
    private Double amount;
    private List<OfferItemDto> items;


    public OfferDto () {}

    public OfferDto(Long id, Long buyerId, Long sellerId, Double amount, List<OfferItemDto> items) {
        this.id = id;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.amount = amount;
        this.items = items;
    }

    public OfferDto(Long buyerId, Long sellerId, Double amount, List<OfferItemDto> items) {
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.amount = amount;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public List<OfferItemDto> getItems() {
        return items;
    }

    public void setItems(List<OfferItemDto> items) {
        this.items = items;
    }
}