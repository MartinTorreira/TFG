package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.ShoppingCart;
import udc.fic.webapp.model.entities.ShoppingCartItem;
import java.util.List;
import java.util.stream.Collectors;

public class ShoppingCartConversor {

    private ShoppingCartConversor() {}

    public final static ShoppingCartDto toShoppingCartDto(ShoppingCart shoppingCart, boolean includeUser) {
        List<ShoppingCartItemDto> items = shoppingCart.getItems().stream()
                .map(ShoppingCartConversor::toShoppingCartItemDto)
                .collect(Collectors.toList());

        UserDto userDto = includeUser ? UserConversor.toUserDto(shoppingCart.getUser()) : null;

        return new ShoppingCartDto(shoppingCart.getId(), items, shoppingCart.getCreatedAt(), userDto);
    }

    public final static ShoppingCart toShoppingCartEntity(ShoppingCartDto shoppingCartDto) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setId(shoppingCartDto.getId());
        shoppingCart.setCreatedAt(shoppingCartDto.getCreatedAt());
        List<ShoppingCartItem> items = shoppingCartDto.getItems().stream()
                .map(ShoppingCartConversor::toShoppingCartItemEntity)
                .collect(Collectors.toList());
        shoppingCart.setItems(items);
        return shoppingCart;
    }

    private final static ShoppingCartItemDto toShoppingCartItemDto(ShoppingCartItem item) {
        return new ShoppingCartItemDto(item.getId(), item.getProductId(), item.getQuantity());
    }

    private final static ShoppingCartItem toShoppingCartItemEntity(ShoppingCartItemDto itemDto) {
        ShoppingCartItem item = new ShoppingCartItem();
        item.setId(itemDto.getId());
        item.setProductId(itemDto.getProductId());
        item.setQuantity(itemDto.getQuantity());
        return item;
    }

}