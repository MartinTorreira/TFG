package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.Offer;
import udc.fic.webapp.model.entities.OfferDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class OfferServiceImpl implements OfferService {

    @Autowired
    private OfferDao offerDao;

    @Override
    public Offer createOffer(Offer offer) {
        return offerDao.save(offer);
    }

    @Override
    public Offer getOffer(Long id) throws InstanceNotFoundException {
        return offerDao.findById(id).orElseThrow(() -> new InstanceNotFoundException("Offer not found", id));
    }

    @Override
    public Offer updateOffer(Long id, Offer updatedOffer) throws InstanceNotFoundException {
        Offer offer = getOffer(id);
        offer.setAmount(updatedOffer.getAmount());
        offer.setItems(updatedOffer.getItems());
        return offerDao.save(offer);
    }

    @Override
    public void deleteOffer(Long id) throws InstanceNotFoundException {
        Offer offer = getOffer(id);
        offerDao.delete(offer);
    }

    @Override
    public List<Offer> getAllOffers() {
        return StreamSupport.stream(offerDao.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public List<Offer> getOffersByBuyerId(Long buyerId) {
        return offerDao.findByBuyerId(buyerId);
    }

    public List<Offer> getOffersBySellerId(Long sellerId) {
        return offerDao.findBySellerId(sellerId);
    }

}