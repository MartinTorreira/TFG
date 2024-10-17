package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ShoppingCartConversor;
import udc.fic.webapp.rest.dto.ShoppingCartItemConversor;
import udc.fic.webapp.rest.dto.ShoppingCartItemDto;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    private ShoppingCartItemDao shoppingCartItemDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ShoppingCartDao shoppingCartDao;

    @Override
    public void createShoppingCart(Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ShoppingCart cart = new ShoppingCart();
        cart.setUser(user);
        cart.setCreatedAt(new Date());

        shoppingCartDao.save(cart);
    }

    @Override
    public List<ShoppingCartItemDto> getShoppingCartItemsByUser(Long userId) throws IllegalArgumentException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Shopping cart not found"));

        List<ShoppingCartItem> items = shoppingCartItemDao.findByCartId(cart.getId());

        return items.stream()
                .map(ShoppingCartItemConversor::toShoppingCartDto)
                .collect(Collectors.toList());

    }

    @Override
    public ShoppingCartItemDto addItemToCart(Long userId, ShoppingCartItemDto dto) throws InstanceNotFoundException {

            User user = userDao.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Shopping cart not found"));

            // Check if product is also in the cart
            if (shoppingCartItemDao.existsByCartIdAndProductId(cart.getId(), dto.getProductId())) {
                throw new IllegalArgumentException("Product already in the cart");
            }

            // User owner of the product cant add it to his cart
            if (cart.getUser().getId().equals(dto.getProductId())) {
                throw new IllegalArgumentException("User cant add his own product to the cart");
            }

            ShoppingCartItem item = new ShoppingCartItem();
            item.setCart(cart);
            item.setProductId(dto.getProductId());
            item.setQuantity(dto.getQuantity());

            shoppingCartItemDao.save(item);

            return ShoppingCartItemConversor.toShoppingCartDto(item);
    }


}