package udc.fic.webapp.model.services;

import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Offer;
import udc.fic.webapp.model.entities.OfferItemDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.List;

@Service
public interface OfferService {

    Offer createOffer(Offer offer);

    Offer getOffer(Long id) throws InstanceNotFoundException;

   // Offer updateOffer(Long id, Offer updatedOffer) throws InstanceNotFoundException;

    void deleteOffer(Long id) throws InstanceNotFoundException;

    List<Offer> getAllOffers();

    public List<Offer> getOffersByBuyerId(Long buyerId);

    public List<Offer> getOffersBySellerId(Long sellerId);
}
