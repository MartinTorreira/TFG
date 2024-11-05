package udc.fic.webapp.model.entities;

import javax.persistence.*;

@Entity
@Table(name = "OfferItem")
public class OfferItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "offer_id", nullable = false)
    private Offer offer;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    public OfferItem(Long id, Offer offer, Product product, Integer quantity) {
        this.id = id;
        this.offer = offer;
        this.product = product;
        this.quantity = quantity;
    }

    public OfferItem(Offer offer, Product product, Integer quantity) {
        this.offer = offer;
        this.product = product;
        this.quantity = quantity;
    }

    public OfferItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}