package udc.fic.webapp.rest.dto;

import org.springframework.lang.Nullable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

public class UserDto {

    public interface AllValidations {}

    public interface UpdateValidations {}

    private Long id;
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private Integer rate;
    private String role;
    private String avatar;
    private ShoppingCartDto cartDto;

    public UserDto() {}

    public UserDto(Long id, String userName, String firstName, String lastName, String email, Integer rate, String role, String avatar, ShoppingCartDto cartDto) {
        this.id = id;
        this.userName = userName != null ? userName.trim() : null;
        this.firstName = firstName.trim();
        this.lastName = lastName.trim();
        this.email = email.trim();
        this.rate = rate;
        this.role = role;
        this.avatar = avatar;
        this.cartDto = cartDto;
    }

    public UserDto(Long id, String userName, String firstName, String lastName, String email, Integer rate, String role, String avatar) {
        this.id = id;
        this.userName = userName != null ? userName.trim() : null;
        this.firstName = firstName.trim();
        this.lastName = lastName.trim();
        this.email = email.trim();
        this.rate = rate;
        this.role = role;
        this.avatar = avatar;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(groups={AllValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class})
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName.trim();
    }

    @NotNull(groups={AllValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class})
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @NotNull(groups={AllValidations.class, UpdateValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class, UpdateValidations.class})
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName.trim();
    }

    @NotNull(groups={AllValidations.class, UpdateValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class, UpdateValidations.class})
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName.trim();
    }

    @NotNull(groups={AllValidations.class, UpdateValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class, UpdateValidations.class})
    @Email(groups={AllValidations.class, UpdateValidations.class})
    public String getEmail() {
        return email;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public void setEmail(String email) {
        this.email = email.trim();
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Min(value = 0, groups={AllValidations.class, UpdateValidations.class})
    @Max(value = 5, groups={AllValidations.class, UpdateValidations.class})
    public Integer getRate() {
        return rate;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    @Nullable
    public ShoppingCartDto getCartDto() {
        return cartDto;
    }

    public void setCartDto(ShoppingCartDto cartDto) {
        this.cartDto = cartDto;
    }
}