package udc.fic.webapp.rest.dto;

import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

public class ShoppingCartDto {

    public ShoppingCartDto(Long id, List<ShoppingCartItemDto> items, Date createdAt, UserDto userDto) {
        this.id = id;
        this.items = items;
        this.createdAt = createdAt;
    }

    public interface AllValidations {}

    public interface UpdateValidations {}

    private Long id;
    private UserDto user;
    private Date createdAt;
    private List<ShoppingCartItemDto> items;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(groups={UserDto.AllValidations.class})
    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Nullable
    public List<ShoppingCartItemDto> getItems() {
        return items;
    }

    public void setItems(List<ShoppingCartItemDto> items) {
        this.items = items;
    }
}