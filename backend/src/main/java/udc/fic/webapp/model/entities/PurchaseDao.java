package udc.fic.webapp.model.entities;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface PurchaseDao extends PagingAndSortingRepository<Purchase, Long> {

    List<Purchase> findAll();

    Optional<Purchase> findByOrderId(String orderId);

    @Query("SELECT p FROM Purchase p WHERE p.buyer.id = :buyerId")
    Page<Purchase> findByBuyerId(@Param("buyerId") Long buyerId, Pageable pageable);

}
