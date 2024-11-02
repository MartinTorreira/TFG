package udc.fic.webapp.model.entities;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PurchaseItemDao extends PagingAndSortingRepository<PurchaseItem, Long> {

    @Query("SELECT pi FROM PurchaseItem pi WHERE pi.purchase.id = :purchaseId")
    List<PurchaseItem> findByPurchaseId(@Param("purchaseId") Long purchaseId);

    @Query("SELECT pi FROM PurchaseItem pi WHERE pi.product.id = :productId")
    Optional<PurchaseItem> findByProductId(@Param("productId") Long productId);
}
