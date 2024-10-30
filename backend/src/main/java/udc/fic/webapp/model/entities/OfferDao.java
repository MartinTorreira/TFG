package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface OfferDao extends PagingAndSortingRepository<Offer, Long> {

    List<Offer> findByBuyerId(Long buyerId);

    List<Offer> findBySellerId(Long sellerId);
}
