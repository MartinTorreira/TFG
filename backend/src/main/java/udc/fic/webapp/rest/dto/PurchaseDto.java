package udc.fic.webapp.rest.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import udc.fic.webapp.model.entities.PurchaseItem;

import java.util.Date;
import java.util.List;

public class PurchaseDto {

    private Long id;
    private Long buyerId;
    private Long sellerId;
    private List<Long> productIds;
    private List<Integer> quantities;
    private List<PurchaseItemDto> purchaseItems;
    private Date purchaseDate;
    private Double amount;
    private String currency;
    private String paymentMethod;
    private String orderId;
    private String captureId;
    private Boolean isRefunded;
    private String purchaseStatus;

    @JsonCreator
    public PurchaseDto(@JsonProperty("purchaseStatus") String purchaseStatus) {
        this.purchaseStatus = purchaseStatus;
    }

    public PurchaseDto() {}

    public PurchaseDto(Long buyerId, Long sellerId, List<Long> productIds, List<Integer> quantities, List<PurchaseItemDto> purchaseItems, Date purchaseDate, Double amount, String currency, String paymentMethod, String orderId, String captureId, Boolean isRefunded, String purchaseStatus) {
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.productIds = productIds;
        this.quantities = quantities;
        this.purchaseItems = purchaseItems;
        this.purchaseDate = purchaseDate;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.orderId = orderId;
        this.captureId = captureId;
        this.isRefunded = isRefunded;
        this.purchaseStatus = purchaseStatus;
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

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public List<PurchaseItemDto> getPurchaseItems() {
        return purchaseItems;
    }

    public void setPurchaseItems(List<PurchaseItemDto> purchaseItems) {
        this.purchaseItems = purchaseItems;
    }

    public Boolean getRefunded() {
        return isRefunded;
    }

    public void setRefunded(Boolean refunded) {
        isRefunded = refunded;
    }

    public List<Integer> getQuantities() {
        return quantities;
    }

    public void setQuantities(List<Integer> quantities) {
        this.quantities = quantities;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getCaptureId() {
        return captureId;
    }

    public void setCaptureId(String captureId) {
        this.captureId = captureId;
    }

    public Boolean getIsRefunded() {
        return isRefunded;
    }

    public void setIsRefunded(Boolean isRefunded) {
        this.isRefunded = isRefunded;
    }

    public String getPurchaseStatus() {
        return purchaseStatus;
    }

    public void setPurchaseStatus(String purchaseStatus) {
        this.purchaseStatus = purchaseStatus;
    }
}
