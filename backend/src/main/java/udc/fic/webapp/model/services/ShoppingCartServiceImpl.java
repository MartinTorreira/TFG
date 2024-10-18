package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.*;

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
    private ProductDao productDao;

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
            Product product = productDao.findById(dto.getProductId())
                    .orElseThrow(() -> new InstanceNotFoundException("Product not found", dto.getProductId()));

            if (cart.getUser().getId().equals(product.getUser().getId())) {
                throw new IllegalArgumentException("User cant add his own product to the shopping cart");
            }

            ShoppingCartItem item = new ShoppingCartItem();
            item.setCart(cart);
            item.setProductId(dto.getProductId());
            item.setQuantity(dto.getQuantity());

            shoppingCartItemDao.save(item);

            return ShoppingCartItemConversor.toShoppingCartDto(item);
    }

    @Override
    public void removeItemFromCart(Long userId, Long itemId) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("User not found", userId));

        ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                .orElseThrow(() -> new InstanceNotFoundException("Shopping cart not found", userId));

        if (!cart.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("The user is not the owner of the cart");
        }

        ShoppingCartItem item = shoppingCartItemDao.findById(itemId)
                .orElseThrow(() -> new InstanceNotFoundException("Shopping cart item not found", itemId));


        if (!item.getCart().getId().equals(cart.getId())) {
            throw new InstanceNotFoundException("Item was not found in the cart", itemId);
        }

        shoppingCartItemDao.delete(item);

    }

    @Override
    public ShoppingCartItemDto updateItemQuantity(Long userId, ShoppingCartItemDto dto) throws InstanceNotFoundException {

            User user = userDao.findById(userId)
                    .orElseThrow(() -> new InstanceNotFoundException("User not found", userId));

            ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                    .orElseThrow(() -> new InstanceNotFoundException("Shopping cart not found", userId));

            ShoppingCartItem item = shoppingCartItemDao.findById(dto.getId())
                    .orElseThrow(() -> new InstanceNotFoundException("Shopping cart item not found", dto.getId()));

            if (!item.getCart().getId().equals(cart.getId())) {
                throw new InstanceNotFoundException("Item was not found in the cart", dto.getId());
            }

            item.setQuantity(dto.getQuantity());

            shoppingCartItemDao.save(item);

            return ShoppingCartItemConversor.toShoppingCartDto(item);
    }

    @Override
    public Long getCartItemIdByProductId(Long userId, Long productId) throws InstanceNotFoundException {

            User user = userDao.findById(userId)
                    .orElseThrow(() -> new InstanceNotFoundException("User not found", userId));

            ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                    .orElseThrow(() -> new InstanceNotFoundException("Shopping cart not found", userId));

            ShoppingCartItem item = shoppingCartItemDao.findByCartIdAndProductId(cart.getId(), productId)
                    .orElseThrow(() -> new InstanceNotFoundException("Shopping cart item not found", productId));

            return item.getId();
    }

    @Override
    public ProductDto getProductByCartItemId(Long userId, Long cartItemId) throws InstanceNotFoundException {

                User user = userDao.findById(userId)
                        .orElseThrow(() -> new InstanceNotFoundException("User not found", userId));

                ShoppingCart cart = shoppingCartDao.findByUserId(userId)
                        .orElseThrow(() -> new InstanceNotFoundException("Shopping cart not found", userId));

                ShoppingCartItem item = shoppingCartItemDao.findById(cartItemId)
                        .orElseThrow(() -> new InstanceNotFoundException("Shopping cart item not found", cartItemId));

                Product product = productDao.findById(item.getProductId())
                        .orElseThrow(() -> new InstanceNotFoundException("Product not found", item.getProductId()));

                return ProductConversor.toDto(product);
    }


}