package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface ShoppingCartDao extends PagingAndSortingRepository<ShoppingCart, Long> {

    Optional<ShoppingCart> findByUserId(Long userId);

   // List<ShoppingCartItem> findItemsById(Long id);
}