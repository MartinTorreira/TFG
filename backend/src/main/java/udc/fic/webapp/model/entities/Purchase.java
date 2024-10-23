package udc.fic.webapp.model.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "Purchase")
public class Purchase {


    public enum PaymentMethod {
        CREDIT_CARD, PAYPAL
    }

    public enum PurchaseStatus {
        PENDING, COMPLETED, REFUNDED
    }

    private Long id;
    private Date purchaseDate;
    private Double amount;
    private User buyer;
    private User seller;
    private PaymentMethod paymentMethod;
    private String orderId;
    private String captureId;
    private Boolean isRefunded;
    private PurchaseStatus purchaseStatus;
    private List<PurchaseItem> items = new ArrayList<>();


    public Purchase(){}

    public Purchase(Date purchaseDate, Double amount, User buyer, User seller, List<PurchaseItem> items, PaymentMethod paymentMethod, String orderId, String captureId, Boolean isRefunded) {
        this.purchaseDate = purchaseDate;
        this.amount = amount;
        this.buyer = buyer;
        this.seller = seller;
        this.items = items;
        this.paymentMethod = paymentMethod;
        this.orderId = orderId;
        this.captureId = captureId;
        this.isRefunded = isRefunded;
        this.purchaseStatus = PurchaseStatus.PENDING;
    }

    public Purchase(Date purchaseDate, Double amount, User buyer, User seller, List<PurchaseItem> items, PaymentMethod paymentMethod, String orderId, String captureId, Boolean isRefunded, PurchaseStatus purchaseStatus) {
        this.purchaseDate = purchaseDate;
        this.amount = amount;
        this.buyer = buyer;
        this.seller = seller;
        this.items = items;
        this.paymentMethod = paymentMethod;
        this.orderId = orderId;
        this.captureId = captureId;
        this.isRefunded = isRefunded;
        this.purchaseStatus = purchaseStatus;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(nullable = false)
    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    @Column(nullable = false)
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
    }

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<PurchaseItem> getItems() {
        return items;
    }

    public void setItems(List<PurchaseItem> items) {
        this.items = items;
    }

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @Column(name = "order_id", unique = true, nullable = false)
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    @Column(name = "capture_id", unique = true, nullable = true)
    public String getCaptureId() {
        return captureId;
    }

    public void setCaptureId(String captureId) {
        this.captureId = captureId;
    }

    @Column(name = "is_refunded", nullable = true)
    public Boolean getIsRefunded() {
        return isRefunded;
    }
    public void setIsRefunded(Boolean isRefunded) {
        this.isRefunded = isRefunded;
    }

    @Column(name = "purchaseStatus", nullable = false)
    public PurchaseStatus getPurchaseStatus() {
        return purchaseStatus;
    }

    public void setPurchaseStatus(PurchaseStatus status) {
        this.purchaseStatus = status;
    }

}