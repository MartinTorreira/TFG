package udc.fic.webapp.model.services;

import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.ShoppingCartItem;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ShoppingCartItemDto;

import java.util.List;

@Service
public interface ShoppingCartService {

    void createShoppingCart(Long userId);

    List<ShoppingCartItemDto> getShoppingCartItemsByUser(Long userId) throws InstanceNotFoundException;

    ShoppingCartItemDto addItemToCart(Long userId, ShoppingCartItemDto dto) throws InstanceNotFoundException;

    void removeItemFromCart(Long userId, Long cartId) throws InstanceNotFoundException;

    ShoppingCartItemDto updateItemQuantity(Long userId, ShoppingCartItemDto dto) throws InstanceNotFoundException;

}