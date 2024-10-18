package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface ShoppingCartItemDao extends PagingAndSortingRepository<ShoppingCartItem, Long> {

    List<ShoppingCartItem> findByCartId(Long cartId);

    boolean existsByCartIdAndProductId(Long cartId, Long productId);

    Optional<ShoppingCartItem> findByCartIdAndProductId(Long cartId, Long productId);

}