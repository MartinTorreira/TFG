package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.common.JwtGenerator;
import udc.fic.webapp.rest.dto.ProductConversor;
import udc.fic.webapp.rest.dto.ProductDto;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private UserService userService;

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



}
