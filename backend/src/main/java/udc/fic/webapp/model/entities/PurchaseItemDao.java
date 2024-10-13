package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface PurchaseItemDao extends PagingAndSortingRepository<PurchaseItem, Long> {

    Optional<PurchaseItem> findByPurchaseId(Long purchaseId);

    Optional<PurchaseItem> findByProductId(Long productId);

}
