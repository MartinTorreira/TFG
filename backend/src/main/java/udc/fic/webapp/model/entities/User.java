package udc.fic.webapp.model.entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    public enum RoleType {
        USER, ADMIN
    }

    private Long id;
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private Integer rate;
    private RoleType role;
    private String avatar;
    private ShoppingCart shoppingCart;


    public User () {}

    public User(String userName, String password, String firstName, String lastName, String email, int rate, RoleType role, String avatar, ShoppingCart shoppingCart) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.rate = rate;
        this.role = role;
        this.avatar = avatar;
        this.shoppingCart = shoppingCart;
    }


    public User(String userName, String password, String firstName, String lastName, String email, int rate, String avatar, ShoppingCart shoppingCart) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.rate = rate;
        this.avatar = avatar;
        this.shoppingCart = shoppingCart;
    }

    public User(String userName, String password, String firstName, String lastName, String email, int rate, String avatar) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.rate = rate;
        this.avatar = avatar;
        this.shoppingCart = new ShoppingCart(this);
    }



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public Integer getRate() {
        return rate;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
    public ShoppingCart getShoppingCart() {
        return shoppingCart;
    }

    public void setShoppingCart(ShoppingCart shoppingCart) {
        this.shoppingCart = shoppingCart;
    }
}