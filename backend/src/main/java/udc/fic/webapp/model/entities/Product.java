package udc.fic.webapp.model.entities;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
public class Product {

    public enum Quality {
        NEEDS_REPAIR, WORN, USED, GOOD, LIKE_NEW, NEW
    }

    private long id;
    private String name;
    private String description;
    private double price;
    private int quantity;
    private Quality quality;
    private Double latitude;
    private Double longitude;
    private List<Product_Images> images;
    private User user;
    private Category category;

    public Product() {}

    public Product(String name, String description, double price, int quantity, Quality quality, Double latitude, Double longitude ,List<Product_Images> images, User user, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.quality = quality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.images = images;
        this.user = user;
        this.category = category;
    }

    public Product(String name, String description, double price, int quantity, Double latitude, Double longitude, List<Product_Images> images, User user, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.images = images;
        this.latitude = latitude;
        this.longitude = longitude;
        this.user = user;
        this.category = category;
    }

    public Product(String name, String description, double price, int quantity, Double latitude, Double longitude, User user, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.user = user;
        this.category = category;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Column(name = "name", unique = true)
    @Size(max = 60)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Size(max = 255)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "price", nullable = false)
    @Positive
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @Column(name = "quantity", nullable = false)
    @Min(value = 1)
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Quality getQuality() {
        return quality;
    }
    public void setQuality(Quality quality) {
        this.quality = quality;
    }


    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Product_Images> getImage() {
        return images;
    }

    public void setImage(List<Product_Images> image) {
        this.images = image;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", nullable = false)
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Column(name = "latitude", nullable = false)
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    @Column(name = "longitude", nullable = false)
    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
