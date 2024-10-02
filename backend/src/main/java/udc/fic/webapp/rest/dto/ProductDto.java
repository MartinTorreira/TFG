package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Category;

import javax.validation.constraints.*;
import java.util.List;

public class ProductDto {

    public interface AllValidations {}
    public interface UpdateValidations {}

    private Long id;
    private UserDto userDto;
    private CategoryDto categoryDto;
    private String name;
    private String description;
    private double price;
    private int quantity;
    private String quality;
    private List<String> images;

    public ProductDto() {}

    public ProductDto(Long id, UserDto userDto, CategoryDto categoryDto, String name, String description, double price, int quantity, String quality, List<String> images) {
        this.id = id;
        this.userDto = userDto;
        this.categoryDto = categoryDto;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.quality = quality;
        this.images = images;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    @NotNull(groups = {AllValidations.class})
    public UserDto getUserDto() {
        return userDto;
    }

    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }

    @NotNull(groups = {AllValidations.class})
    public CategoryDto getCategoryDto() {
        return categoryDto;
    }

    public void setCategory(CategoryDto categoryDto) {
        this.categoryDto = categoryDto;
    }

    @NotNull(groups = {AllValidations.class, UpdateValidations.class})
    @Size(min = 1, max = 60, groups = {AllValidations.class, UpdateValidations.class})
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Size(max = 255, groups = {AllValidations.class, UpdateValidations.class})
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @NotNull(groups = {AllValidations.class, UpdateValidations.class})
    @Positive(groups = {AllValidations.class, UpdateValidations.class})
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @NotNull(groups = {AllValidations.class, UpdateValidations.class})
    @Min(value = 1, groups = {AllValidations.class, UpdateValidations.class})
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @NotNull(groups = {AllValidations.class, UpdateValidations.class})
    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
