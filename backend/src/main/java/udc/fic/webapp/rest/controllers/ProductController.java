package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.Category;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.dto.CategoryConversor;
import udc.fic.webapp.rest.dto.CategoryDto;
import udc.fic.webapp.rest.dto.ProductConversor;
import udc.fic.webapp.rest.dto.ProductDto;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<ProductDto> addProduct(@RequestAttribute Long userId, @RequestBody ProductDto productDto) throws InstanceNotFoundException {

        Product product = productService.addProduct(
                userId,
                productDto.getCategoryDto().getId(),
                productDto.getName(),
                productDto.getDescription(),
                productDto.getPrice(),
                productDto.getQuantity(),
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



    @GetMapping("/allCategories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return new ResponseEntity<>(CategoryConversor.toDtoList(productService.getCategories()), HttpStatus.OK);
    }



}
