// package udc.fic.webapp.model.entities;

// import javax.persistence.*;
// import java.time.LocalDateTime;
// import java.util.Date;

// @Entity
// public class Favorite {

//     private Long id;
//     private User user;
//     private Product product;
//     private LocalDateTime favoritedAt;

//     public Favorite() {}

//     public Favorite(User user, Product product, LocalDateTime favoritedAt) {
//         this.user = user;
//         this.product = product;
//         this.favoritedAt = favoritedAt;
//     }

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     @ManyToOne
//     @JoinColumn(name = "userId", nullable = false)
//     public User getUser() {
//         return user;
//     }

//     public void setUser(User user) {
//         this.user = user;
//     }

//     @ManyToOne
//     @JoinColumn(name = "productId", nullable = false)
//     public Product getProduct() {
//         return product;
//     }

//     public void setProduct(Product product) {
//         this.product = product;
//     }

//     @Column(name = "favoritedAt", nullable = false)
//     public LocalDateTime getFavoritedAt() {
//         return favoritedAt;
//     }

//     public void setFavoritedAt(LocalDateTime favoritedAt) {
//         this.favoritedAt = favoritedAt;
//     }
// }
