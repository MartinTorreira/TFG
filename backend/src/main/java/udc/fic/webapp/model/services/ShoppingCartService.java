package udc.fic.webapp.model.services;

import org.springframework.stereotype.Service;
import udc.fic.webapp.rest.dto.ShoppingCartItemDto;

import java.util.List;

@Service
public interface ShoppingCartService {

    void createShoppingCart(Long userId);

    List<ShoppingCartItemDto> getShoppingCartItems(Long userId);

    ShoppingCartItemDto addItemToCart(Long cartId, Long productId, Integer quantity);

    void removeItemFromCart(Long itemId);

    void updateItemQuantity(Long itemId, Integer quantity);
}