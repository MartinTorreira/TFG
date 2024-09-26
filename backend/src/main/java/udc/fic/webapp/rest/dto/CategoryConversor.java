package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Category;

import java.util.List;
import java.util.stream.Collectors;

public class CategoryConversor {

    public static CategoryDto toDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setParentCategoryId(category.getParentCategory() != null ? category.getParentCategory().getId() : null);
        dto.setSubcategoryIds(category.getSubcategories() != null ? category.getSubcategories().stream().map(Category::getId).collect(Collectors.toList()) : null);
        return dto;
    }

    public static Category toEntity(CategoryDto dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        return category;
    }

    public static List<CategoryDto> toDtoList(List<Category> categoryList) {
        return categoryList.stream().map(CategoryConversor::toDto).collect(Collectors.toList());
    }

}
