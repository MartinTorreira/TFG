package udc.fic.webapp.rest.dto;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class FavoriteDto {

    public interface AllValidations {}
    public interface UpdateValidations {}

    private Long id;
    private UserDto userDto;
    private ProductDto productDto;
    private LocalDateTime favoritedAt;

    public FavoriteDto() {}

    public FavoriteDto(Long id, UserDto userDto, ProductDto productDto, LocalDateTime favoritedAt) {
        this.id = id;
        this.userDto = userDto;
        this.productDto = productDto;
        this.favoritedAt = favoritedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(groups = {ProductDto.AllValidations.class})
    public UserDto getUserDto() {
        return userDto;
    }

    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }

    @NotNull(groups = {ProductDto.AllValidations.class})
    public ProductDto getProductDto() {
        return productDto;
    }

    public void setProductDto(ProductDto productDto) {
        this.productDto = productDto;
    }

    @NotNull(groups = {ProductDto.AllValidations.class})
    public LocalDateTime getFavoritedAt() {
        return favoritedAt;
    }

    public void setFavoritedAt(LocalDateTime favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}
