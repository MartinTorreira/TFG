package udc.fic.webapp.model.entities;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductDao extends PagingAndSortingRepository<Product, Long> {

    Product findProductById(Long id);

    @Query("SELECT p FROM Product p WHERE p.user.id = :userId")
    Page<Product> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Modifying
    @Transactional
    @Query("DELETE FROM Product_Images p WHERE p.product.id = :productId")
    void deleteAllImagesByProductId(@Param("productId") Long productId);

    @Query("SELECT pi.product FROM PurchaseItem pi WHERE pi.purchase.id = :purchaseId")
    List<Product> findProductsByPurchaseId(@Param("purchaseId") Long purchaseId);

    List<Product> findAllById(Iterable<Long> ids);

}
