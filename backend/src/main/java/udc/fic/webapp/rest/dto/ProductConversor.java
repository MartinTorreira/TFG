package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Product;


public class ProductConversor {

    private ProductConversor() {}


    public final static Product toEntity(ProductDto dto) {

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setImage(dto.getImages());
        product.setCategory(CategoryConversor.toEntity(dto.getCategoryDto()));
        product.setUser(UserConversor.toUser(dto.getUserDto()));

        return product;
    }


    public final static ProductDto toDto(Product product) {

        ProductDto dto = new ProductDto();
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImages(product.getImage());
        dto.setCategory(CategoryConversor.toDto(product.getCategory()));
        dto.setUserDto(UserConversor.toUserDto(product.getUser()));

        return dto;
    }




}