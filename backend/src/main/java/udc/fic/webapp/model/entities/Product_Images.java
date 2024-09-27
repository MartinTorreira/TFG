package udc.fic.webapp.model.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "product_images")
public class Product_Images {

    @Embeddable
    public static class ProductImageId implements Serializable {
        private Long productId;
        private String image;

        public ProductImageId() {
        }

        public ProductImageId(Long productId, String image) {
            this.productId = productId;
            this.image = image;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ProductImageId that = (ProductImageId) o;
            return Objects.equals(productId, that.productId) && Objects.equals(image, that.image);
        }

        @Override
        public int hashCode() {
            return Objects.hash(productId, image);
        }
    }

    @EmbeddedId
    private ProductImageId id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public Product_Images() {
    }

    public Product_Images(Product product, String image) {
        this.id = new ProductImageId(product.getId(), image);
        this.product = product;
    }

    public ProductImageId getId() {
        return id;
    }

    public void setId(ProductImageId id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getImage() {
        return id.getImage();
    }

    public void setImage(String image) {
        this.id.setImage(image);
    }
}