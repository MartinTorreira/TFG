package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;


public interface PurchaseDao extends PagingAndSortingRepository<Purchase, Long> {

    List<Purchase> findAll();

    Optional<Purchase> findByOrderId(String orderId);

}
