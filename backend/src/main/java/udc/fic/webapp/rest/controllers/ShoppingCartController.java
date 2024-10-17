package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ProductConversor;
import udc.fic.webapp.rest.dto.ProductDto;
import udc.fic.webapp.rest.dto.ShoppingCartItemDto;
import udc.fic.webapp.model.services.ShoppingCartService;

import java.util.List;

@RestController
@RequestMapping("/shoppingCart")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private ShoppingCartDao shoppingCartDao;


    @GetMapping("/getItems")
    public ResponseEntity<List<ShoppingCartItemDto>> getCartItems(@RequestAttribute Long userId) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<ShoppingCartItemDto> items = shoppingCartService.getShoppingCartItemsByUser(userId);

        return ResponseEntity.ok(items);

    }

    @PostMapping("/addProduct")
    public ResponseEntity<ShoppingCartItemDto> addItemToCart(@RequestAttribute Long userId, @RequestBody ShoppingCartItemDto dto) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if product quantity is greater than cart quantity
        Product product = productDao.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (product.getQuantity() < dto.getQuantity()) {
            throw new IllegalArgumentException("Cart quantity must be less than product quantity");
        }

        ShoppingCartItemDto item = shoppingCartService.addItemToCart(userId, dto);

        return ResponseEntity.ok(item);

    }

    @DeleteMapping("/{itemId}/removeItem")
    public ResponseEntity<Void> removeItemFromCart(@RequestAttribute Long userId, @PathVariable Long itemId) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Shopping cart not found"));


        shoppingCartService.removeItemFromCart(userId, itemId);

        return ResponseEntity.noContent().build();

    }



    @GetMapping("/getProducts")
    public ResponseEntity<List<ProductDto>> getProducts(@RequestAttribute Long userId) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<ShoppingCartItemDto> items = shoppingCartService.getShoppingCartItemsByUser(userId);

        List<Product> products = items.stream()
                .map(item -> {
                    return productDao.findById(item.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                })
                .toList();

        List<ProductDto> productDtos = products.stream().map(ProductConversor::toDto).toList();

        return ResponseEntity.ok(productDtos);

    }


    @PutMapping("/updateQuantity")
    public ResponseEntity<ShoppingCartItemDto> updateItemQuantity(@RequestAttribute Long userId, @RequestBody ShoppingCartItemDto dto) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ShoppingCartItemDto item = shoppingCartService.updateItemQuantity(userId, dto);

        return ResponseEntity.ok(item);

    }



  //  @GetMapping("/{userId}/items")
  //  public List<ShoppingCartItemDto> getUserCartItems(@RequestAttribute Long userId) throws InstanceNotFoundException {
        //return shoppingCartService.getShoppingCartItemsByUser(userId);
 //       return null;
  //  }


}