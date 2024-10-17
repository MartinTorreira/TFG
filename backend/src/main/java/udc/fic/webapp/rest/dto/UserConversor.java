package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.ShoppingCart;
import udc.fic.webapp.model.entities.User;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class UserConversor {

    private UserConversor() {}

    public final static UserDto toUserDto(User user) {

        // Asociate shopping cart in case it is not null
        ShoppingCartDto shoppingCartDto = null;
        if (user.getShoppingCart() != null) {
            shoppingCartDto = ShoppingCartConversor.toShoppingCartDto(user.getShoppingCart(), false);
        }

        return new UserDto(user.getId(), user.getUserName(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRate(),
                user.getRole().toString(), user.getAvatar(), shoppingCartDto);
    }

    public final static User toUser(UserDto userDto) {

        User user = new User(userDto.getUserName(), userDto.getPassword(), userDto.getFirstName(), userDto.getLastName(), userDto.getEmail(),
                userDto.getRate(), userDto.getAvatar());

        // Create a new shopping cart in case it is not null
        if (userDto.getCartDto() != null) {
            ShoppingCart shoppingCart = ShoppingCartConversor.toShoppingCartEntity(userDto.getCartDto());
            shoppingCart.setUser(user);
            shoppingCart.setCreatedAt(new Date());
            user.setShoppingCart(shoppingCart);
        } else if (user.getShoppingCart() == null) {
            user.setShoppingCart(new ShoppingCart(user));
        }

        return user;
    }

    public final static AuthenticatedUserDto toAuthenticatedUserDto(String serviceToken, User user) {
        return new AuthenticatedUserDto(serviceToken, toUserDto(user));
    }

    public final static List<UserDto> toUserDtoList(List<User> users) {
        return users.stream().map(UserConversor::toUserDto).collect(Collectors.toList());
    }
}