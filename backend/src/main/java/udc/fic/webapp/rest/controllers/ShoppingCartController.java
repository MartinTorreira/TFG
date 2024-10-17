package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.rest.dto.ShoppingCartItemDto;
import udc.fic.webapp.model.services.ShoppingCartService;

import java.util.List;

@RestController
@RequestMapping("/shopping-cart")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @GetMapping("/{cartId}/items")
    public List<ShoppingCartItemDto> getCartItems(@PathVariable Long cartId) {
        return shoppingCartService.getShoppingCartItems(cartId);
    }

    @PostMapping("/{cartId}/items")
    public ShoppingCartItemDto addItemToCart(@PathVariable Long cartId, @RequestParam Long productId, @RequestParam Integer quantity) {
        return shoppingCartService.addItemToCart(cartId, productId, quantity);
    }

    @DeleteMapping("/items/{itemId}")
    public void removeItemFromCart(@PathVariable Long itemId) {
        shoppingCartService.removeItemFromCart(itemId);
    }

    @PutMapping("/items/{itemId}")
    public void updateItemQuantity(@PathVariable Long itemId, @RequestParam Integer quantity) {
        shoppingCartService.updateItemQuantity(itemId, quantity);
    }
}