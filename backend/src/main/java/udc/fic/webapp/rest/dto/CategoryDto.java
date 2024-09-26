package udc.fic.webapp.rest.dto;

import java.util.List;

public class CategoryDto {
    private Long id;
    private String name;
    private Long parentCategoryId;
    private List<Long> subcategoryIds;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, Long parentCategoryId, List<Long> subcategoryIds) {
        this.id = id;
        this.name = name;
        this.parentCategoryId = parentCategoryId;
        this.subcategoryIds = subcategoryIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(Long parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public List<Long> getSubcategoryIds() {
        return subcategoryIds;
    }

    public void setSubcategoryIds(List<Long> subcategoryIds) {
        this.subcategoryIds = subcategoryIds;
    }
}
