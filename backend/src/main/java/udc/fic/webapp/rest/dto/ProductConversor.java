package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.Product_Images;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


public class ProductConversor {

    private ProductConversor() {}


    public final static Product toEntity(ProductDto dto) {

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setQuality(Product.Quality.valueOf(dto.getQuality().toString()));
        product.setLatitude(dto.getLatitude());
        product.setLongitude(dto.getLongitude());
        product.setImage(convertImages(dto.getImages(), product));
        product.setCategory(CategoryConversor.toEntity(dto.getCategoryDto()));
        product.setUser(UserConversor.toUser(dto.getUserDto()));

        return product;
    }


    public final static ProductDto toDto(Product product) {

        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setQuality(product.getQuality().toString());
        dto.setLatitude(product.getLatitude());
        dto.setLongitude(product.getLongitude());
        dto.setImages(product.getImage().stream().map(Product_Images::getImage).collect(Collectors.toList()));
        dto.setCategory(CategoryConversor.toDto(product.getCategory()));
        dto.setUserDto(UserConversor.toUserDto(product.getUser()));

        return dto;
    }


    private static List<Product_Images> convertImages(List<String> imageUrls, Product product) {
        return imageUrls.stream()
                .map(image -> {
                    Product_Images productImage = new Product_Images();
                    productImage.setImage(image);
                    productImage.setProduct(product);
                    return productImage;
                })
                .collect(Collectors.toList());
    }





}