package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;


public interface PurchaseDao extends PagingAndSortingRepository<Purchase, Long> {

    List<Purchase> findAll();
}
