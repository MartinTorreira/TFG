package udc.fic.webapp.rest.dto;

import udc.fic.webapp.rest.dto.ShoppingCartItemDto;
import udc.fic.webapp.model.entities.ShoppingCartItem;

public class ShoppingCartItemConversor {

    public static ShoppingCartItemDto toShoppingCartDto(ShoppingCartItem shoppingCartItem) {
        ShoppingCartItemDto dto = new ShoppingCartItemDto();
        dto.setId(shoppingCartItem.getId());
        dto.setCartId(shoppingCartItem.getCart().getId());
        dto.setProductId(shoppingCartItem.getProductId());
        dto.setQuantity(shoppingCartItem.getQuantity());
        return dto;
    }

    public static ShoppingCartItem toShoppingCartEntity(ShoppingCartItemDto dto) {
        ShoppingCartItem shoppingCartItem = new ShoppingCartItem();
        shoppingCartItem.setId(dto.getId());
        shoppingCartItem.setProductId(dto.getProductId());
        shoppingCartItem.setQuantity(dto.getQuantity());
        return shoppingCartItem;
    }
}