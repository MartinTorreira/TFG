package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
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
    public List<ShoppingCartItemDto> getShoppingCartItems(Long userId) {
        return shoppingCartItemDao.findByCartId(userId).stream()
                .map(ShoppingCartItemConversor::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ShoppingCartItemDto addItemToCart(Long cartId, Long productId, Integer quantity) {

        ShoppingCartItem item = new ShoppingCartItem();
        ShoppingCartItem savedItem = shoppingCartItemDao.save(item);
        return ShoppingCartItemConversor.toDto(savedItem);
    }

    @Override
    public void removeItemFromCart(Long itemId) {
        shoppingCartItemDao.deleteById(itemId);
    }

    @Override
    public void updateItemQuantity(Long itemId, Integer quantity) {
        ShoppingCartItem item = shoppingCartItemDao.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        item.setQuantity(quantity);
        shoppingCartItemDao.save(item);
    }
}