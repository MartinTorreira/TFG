package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;
import java.util.List;

public interface ShoppingCartItemDao extends PagingAndSortingRepository<ShoppingCartItem, Long> {

    List<ShoppingCartItem> findByCartId(Long userId);
}
