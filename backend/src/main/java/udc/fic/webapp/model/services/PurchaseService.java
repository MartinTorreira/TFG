package udc.fic.webapp.model.services;

import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.List;

@Service
public interface PurchaseService {

    Purchase createPurchase(Long buyerId, Long sellerId, List<Long> productIds, List<Integer> quantities, Double amount, String paymentMethod) throws InstanceNotFoundException;

}
