package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.Category;
import udc.fic.webapp.model.entities.Favorite;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.ProductDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.FavoriteService;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/add")
    public ResponseEntity<ProductDto> addProduct(@RequestAttribute Long userId, @RequestBody ProductDto productDto) throws InstanceNotFoundException {

        Product product = productService.addProduct(
                userId,
                productDto.getCategoryDto().getId(),
                productDto.getName(),
                productDto.getDescription(),
                productDto.getPrice(),
                productDto.getQuantity(),
                productDto.getQuality(),
                productDto.getImages()
        );

        ProductDto createdPostDto = ProductConversor.toDto(product);

        return new ResponseEntity<>(createdPostDto, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<Page<ProductDto>> getLatestProducts(@RequestParam(name = "page", defaultValue = "0") int page,
                                                              @RequestParam(name = "size", defaultValue = "9") int size) {

        Page<ProductDto> products = productService.getLatestProducts(page, size).map(ProductConversor::toDto);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{productId}/details")
    public ResponseEntity<ProductDto> getProductDetails(@PathVariable Long productId) throws InstanceNotFoundException {
        Product product = productService.findProductById(productId);
        return new ResponseEntity<>(ProductConversor.toDto(product), HttpStatus.OK);
    }


    @GetMapping("/{userId}/productList")
    public ResponseEntity<Page<ProductDto>> getProductsByUserId(@PathVariable Long userId, @RequestParam(name = "page", defaultValue = "0") int page,
                                                                @RequestParam(name = "size", defaultValue = "9") int size) throws InstanceNotFoundException {
        Page<ProductDto> products = productService.getProductsByUserId(userId, page, size).map(ProductConversor::toDto);
        return ResponseEntity.ok(products);
    }



    @GetMapping("/allCategories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return new ResponseEntity<>(CategoryConversor.toDtoList(productService.getCategories()), HttpStatus.OK);
    }




    // Favorite Product endpoints --------------------------------------------------------------------------------------------------------------------------

    @PostMapping("/{productId}/addFavorite")
    public ResponseEntity<FavoriteDto> addFavorite(@RequestAttribute Long userId, @PathVariable Long productId) throws InstanceNotFoundException {
        Favorite favorite = favoriteService.addFavorite(userId, productId, LocalDateTime.now());
        return new ResponseEntity<>(FavoriteConversor.toDto(favorite), HttpStatus.OK);
    }

    @GetMapping("/favorites")
    public ResponseEntity<Page<FavoriteDto>> getLatestFavorites(@RequestAttribute Long userId, @RequestParam(name = "page", defaultValue = "0") int page,
                                                                @RequestParam(name = "size", defaultValue = "9") int size) {

        Page<FavoriteDto> favorites = favoriteService.getLatestFavorites(page, size).map(FavoriteConversor::toDto);
        return ResponseEntity.ok(favorites);
    }


    @DeleteMapping("/{productId}/removeFavorite")
    public ResponseEntity<Void> removeFavorite(@RequestAttribute Long userId, @PathVariable Long productId) throws InstanceNotFoundException {
        favoriteService.removeFavorite(userId, productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }





}
